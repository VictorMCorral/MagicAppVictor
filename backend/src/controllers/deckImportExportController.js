const prisma = require('../utils/prisma');
const scryfallService = require('../services/scryfallService');

/**
 * Importar mazo desde archivo .txt
 * Formato esperado:
 * 4 Lightning Bolt
 * 2 Counterspell
 * 1 Black Lotus
 */
const importDeck = async (req, res) => {
  try {
    const { id } = req.params;
    const { deckList, clearExisting } = req.body;

    if (!deckList || typeof deckList !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'El campo "deckList" es requerido y debe ser un string'
      });
    }

    // Verificar que el mazo pertenece al usuario
    const deck = await prisma.deck.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!deck) {
      return res.status(404).json({
        success: false,
        message: 'Mazo no encontrado'
      });
    }

    // Si se solicita limpiar el mazo existente
    if (clearExisting) {
      await prisma.deckCard.deleteMany({
        where: { deckId: id }
      });
    }

    // Parsear el deck list
    const lines = deckList.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const results = {
      success: [],
      failed: []
    };

    for (const line of lines) {
      // Ignorar comentarios y líneas vacías
      if (line.startsWith('//') || line.startsWith('#')) {
        continue;
      }

      // Parsear cantidad y nombre
      const match = line.match(/^(\d+)\s+(.+)$/);
      
      if (!match) {
        results.failed.push({
          line,
          reason: 'Formato inválido. Usa: "cantidad nombre_carta"'
        });
        continue;
      }

      const quantity = parseInt(match[1]);
      const cardName = match[2].trim();

      try {
        // Buscar carta en Scryfall (fuzzy search)
        const cardData = await scryfallService.findCardByName(cardName);

        if (!cardData.success) {
          results.failed.push({
            line,
            cardName,
            reason: 'Carta no encontrada en Scryfall'
          });
          continue;
        }

        const card = cardData.data;

        // Verificar si la carta ya existe en el mazo
        const existingCard = await prisma.deckCard.findUnique({
          where: {
            deckId_scryfallId: {
              deckId: id,
              scryfallId: card.scryfallId
            }
          }
        });

        if (existingCard) {
          // Actualizar cantidad
          await prisma.deckCard.update({
            where: { id: existingCard.id },
            data: { quantity: existingCard.quantity + quantity }
          });
        } else {
          // Crear nueva entrada
          await prisma.deckCard.create({
            data: {
              deckId: id,
              scryfallId: card.scryfallId,
              name: card.name,
              manaCost: card.manaCost,
              type: card.type,
              rarity: card.rarity,
              setCode: card.setCode,
              setName: card.setName,
              imageUrl: card.imageUrl,
              oracleText: card.oracleText,
              colors: card.colors,
              cmc: card.cmc,
              priceEur: card.priceEur,
              priceUsd: card.priceUsd,
              quantity
            }
          });
        }

        results.success.push({
          cardName: card.name,
          quantity
        });

        // Respetar rate limit de Scryfall (50-100ms entre requests)
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        results.failed.push({
          line,
          cardName,
          reason: error.message
        });
      }
    }

    res.json({
      success: true,
      message: `Importación completada. ${results.success.length} cartas añadidas, ${results.failed.length} fallidas`,
      data: results
    });

  } catch (error) {
    console.error('Error al importar mazo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al importar mazo'
    });
  }
};

/**
 * Exportar mazo a formato .txt
 */
const exportDeck = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el mazo pertenece al usuario
    const deck = await prisma.deck.findFirst({
      where: { id, userId: req.user.id },
      include: {
        cards: {
          orderBy: [
            { type: 'asc' },
            { name: 'asc' }
          ]
        }
      }
    });

    if (!deck) {
      return res.status(404).json({
        success: false,
        message: 'Mazo no encontrado'
      });
    }

    // Generar el texto del deck list
    let deckList = `// ${deck.name}\n`;
    
    if (deck.description) {
      deckList += `// ${deck.description}\n`;
    }
    
    if (deck.format) {
      deckList += `// Formato: ${deck.format}\n`;
    }
    
    deckList += `\n`;

    // Agrupar cartas por tipo
    const groupedCards = {};
    deck.cards.forEach(card => {
      const mainType = card.type.split('—')[0].trim();
      if (!groupedCards[mainType]) {
        groupedCards[mainType] = [];
      }
      groupedCards[mainType].push(card);
    });

    // Ordenar tipos
    const typeOrder = ['Creature', 'Planeswalker', 'Instant', 'Sorcery', 'Artifact', 'Enchantment', 'Land'];
    const sortedTypes = Object.keys(groupedCards).sort((a, b) => {
      const indexA = typeOrder.findIndex(t => a.includes(t));
      const indexB = typeOrder.findIndex(t => b.includes(t));
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    // Generar lista por tipo
    sortedTypes.forEach(type => {
      deckList += `// ${type}\n`;
      groupedCards[type].forEach(card => {
        deckList += `${card.quantity} ${card.name}\n`;
      });
      deckList += `\n`;
    });

    // Estadísticas finales
    const totalCards = deck.cards.reduce((sum, card) => sum + card.quantity, 0);
    deckList += `\n// Total de cartas: ${totalCards}\n`;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${deck.name.replace(/[^a-zA-Z0-9]/g, '_')}.txt"`);
    res.send(deckList);

  } catch (error) {
    console.error('Error al exportar mazo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al exportar mazo'
    });
  }
};

module.exports = {
  importDeck,
  exportDeck
};
