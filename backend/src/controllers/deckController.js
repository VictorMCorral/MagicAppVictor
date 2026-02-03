const { body, validationResult } = require('express-validator');
const prisma = require('../utils/prisma');
const scryfallService = require('../services/scryfallService');

/**
 * Validaciones para crear mazo
 */
const createDeckValidation = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('El nombre debe tener entre 1 y 100 caracteres'),
  body('description').optional(),
  body('format').optional(),
  body('isPublic').optional().isBoolean()
];

/**
 * Listar todos los mazos del usuario autenticado
 */
const getMyDecks = async (req, res) => {
  try {
    const decks = await prisma.deck.findMany({
      where: { userId: req.user.id },
      include: {
        _count: {
          select: { cards: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json({
      success: true,
      data: decks
    });
  } catch (error) {
    console.error('Error al obtener mazos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener mazos'
    });
  }
};

/**
 * Obtener un mazo específico con todas sus cartas
 */
const getDeckById = async (req, res) => {
  try {
    const { id } = req.params;

    const deck = await prisma.deck.findFirst({
      where: {
        id,
        userId: req.user.id
      },
      include: {
        cards: {
          orderBy: [
            { type: 'asc' },
            { name: 'asc' }
          ]
        },
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    if (!deck) {
      return res.status(404).json({
        success: false,
        message: 'Mazo no encontrado'
      });
    }

    // Calcular estadísticas del mazo
    const stats = calculateDeckStats(deck.cards);

    res.json({
      success: true,
      data: {
        ...deck,
        stats
      }
    });
  } catch (error) {
    console.error('Error al obtener mazo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener mazo'
    });
  }
};

/**
 * Crear nuevo mazo
 */
const createDeck = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, description, format, isPublic } = req.body;

    const deck = await prisma.deck.create({
      data: {
        name,
        description,
        format,
        isPublic: isPublic || false,
        userId: req.user.id
      },
      include: {
        _count: {
          select: { cards: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Mazo creado exitosamente',
      data: deck
    });
  } catch (error) {
    console.error('Error al crear mazo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear mazo'
    });
  }
};

/**
 * Actualizar mazo
 */
const updateDeck = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, format, isPublic } = req.body;

    // Verificar que el mazo pertenece al usuario
    const existingDeck = await prisma.deck.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existingDeck) {
      return res.status(404).json({
        success: false,
        message: 'Mazo no encontrado'
      });
    }

    const deck = await prisma.deck.update({
      where: { id },
      data: {
        name: name || existingDeck.name,
        description: description !== undefined ? description : existingDeck.description,
        format: format || existingDeck.format,
        isPublic: isPublic !== undefined ? isPublic : existingDeck.isPublic
      }
    });

    res.json({
      success: true,
      message: 'Mazo actualizado exitosamente',
      data: deck
    });
  } catch (error) {
    console.error('Error al actualizar mazo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar mazo'
    });
  }
};

/**
 * Eliminar mazo
 */
const deleteDeck = async (req, res) => {
  try {
    const { id } = req.params;

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

    await prisma.deck.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Mazo eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar mazo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar mazo'
    });
  }
};

/**
 * Añadir carta al mazo
 */
const addCardToDeck = async (req, res) => {
  try {
    const { id } = req.params;
    const { scryfallId, quantity } = req.body;

    if (!scryfallId) {
      return res.status(400).json({
        success: false,
        message: 'scryfallId es requerido'
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

    // Obtener datos de la carta desde Scryfall
    const cardData = await scryfallService.getCardById(scryfallId);

    if (!cardData.success) {
      return res.status(404).json({
        success: false,
        message: 'Carta no encontrada en Scryfall'
      });
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

    let deckCard;

    if (existingCard) {
      // Actualizar cantidad
      deckCard = await prisma.deckCard.update({
        where: { id: existingCard.id },
        data: {
          quantity: quantity || existingCard.quantity + 1
        }
      });
    } else {
      // Crear nueva entrada
      deckCard = await prisma.deckCard.create({
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
          quantity: quantity || 1
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Carta añadida al mazo',
      data: deckCard
    });
  } catch (error) {
    console.error('Error al añadir carta:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al añadir carta al mazo'
    });
  }
};

/**
 * Actualizar cantidad de una carta en el mazo
 */
const updateCardQuantity = async (req, res) => {
  try {
    const { id, cardId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Cantidad debe ser mayor a 0'
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

    const deckCard = await prisma.deckCard.update({
      where: { id: cardId },
      data: { quantity }
    });

    res.json({
      success: true,
      message: 'Cantidad actualizada',
      data: deckCard
    });
  } catch (error) {
    console.error('Error al actualizar cantidad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar cantidad'
    });
  }
};

/**
 * Eliminar carta del mazo
 */
const removeCardFromDeck = async (req, res) => {
  try {
    const { id, cardId } = req.params;

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

    await prisma.deckCard.delete({
      where: { id: cardId }
    });

    res.json({
      success: true,
      message: 'Carta eliminada del mazo'
    });
  } catch (error) {
    console.error('Error al eliminar carta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar carta del mazo'
    });
  }
};

/**
 * Calcular estadísticas del mazo
 */
function calculateDeckStats(cards) {
  const totalCards = cards.reduce((sum, card) => sum + card.quantity, 0);
  
  const colorDistribution = {};
  const typeDistribution = {};
  const rarityDistribution = {};
  const cmcDistribution = {};
  
  let totalValue = 0;

  cards.forEach(card => {
    // Colores
    card.colors.forEach(color => {
      colorDistribution[color] = (colorDistribution[color] || 0) + card.quantity;
    });

    // Tipos (simplificado)
    const mainType = card.type.split('—')[0].trim();
    typeDistribution[mainType] = (typeDistribution[mainType] || 0) + card.quantity;

    // Rareza
    rarityDistribution[card.rarity] = (rarityDistribution[card.rarity] || 0) + card.quantity;

    // CMC
    const cmc = Math.floor(card.cmc);
    cmcDistribution[cmc] = (cmcDistribution[cmc] || 0) + card.quantity;

    // Valor total (EUR)
    if (card.priceEur) {
      totalValue += card.priceEur * card.quantity;
    }
  });

  return {
    totalCards,
    uniqueCards: cards.length,
    colorDistribution,
    typeDistribution,
    rarityDistribution,
    cmcDistribution,
    totalValueEur: parseFloat(totalValue.toFixed(2)),
    avgCmc: totalCards > 0 ? parseFloat((cards.reduce((sum, card) => sum + (card.cmc * card.quantity), 0) / totalCards).toFixed(2)) : 0
  };
}

module.exports = {
  getMyDecks,
  getDeckById,
  createDeck,
  updateDeck,
  deleteDeck,
  addCardToDeck,
  updateCardQuantity,
  removeCardFromDeck,
  createDeckValidation
};
