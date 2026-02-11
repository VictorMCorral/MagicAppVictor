import React, { useState, useRef, useEffect } from 'react';
import { Camera, TrendingUp, Plus, Trash2, X, Save } from 'lucide-react';
import Tesseract from 'tesseract.js';
import cardService from '../services/cardService';

const InventoryPage = () => {
  // Inicializar inventario desde localStorage
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('mtg_inventory');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showScanner, setShowScanner] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Guardar inventario en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('mtg_inventory', JSON.stringify(inventory));
  }, [inventory]);

  // Estados para resultados de búsqueda
  const [foundCards, setFoundCards] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Función para buscar cartas basadas en el texto OCR
  const searchCardsFromOCR = async (text) => {
    if (!text || text.trim().length < 3) return;
    
    setIsSearching(true);
    setFoundCards([]);
    try {
      // 1. Extraer Número de Coleccionista (Ej: 001/274 -> 001) - Muy fiable
      const cnMatch = text.match(/(\d{1,4})\/(\d{1,4})/);
      const collectorNumber = cnMatch ? cnMatch[1] : null;

      // 2. Limpiar líneas para extraer nombres potenciales
      const lines = text.split('\n')
        .map(l => l.trim())
        .filter(l => l.length >= 2); // Bajamos a 2 para capturar líneas cortas
      
      // Filtrado avanzado: Buscar líneas que parezcan nombres (letras y espacios)
      const potentialNames = lines.map(line => {
        return line
          .replace(/^[^a-zA-Z]+/, '') // Quitar basura al inicio (solo dejar letras al empezar)
          .replace(/[^a-zA-Z0-9\s,']+/g, ' ') // Limpiar caracteres especiales internos
          .trim();
      }).filter(n => n.length > 3 && /[a-zA-Z]/.test(n)); // Debe tener letras y longitud mínima

      let allResults = [];
      let queries = [];

      // Query 1: Combinación ganadora (Nombre + Número)
      if (potentialNames.length > 0 && collectorNumber) {
        const nameKey = potentialNames[0].split(' ').slice(0, 3).join(' ');
        queries.push(`"${nameKey}" cn:${collectorNumber}`);
      }

      // Query 2: Priorizar la línea que contenga palabras clave de MTG o sea más limpia
      // Si hay una línea con texto como "the", "of", "Dragon", etc., subirla de prioridad
      const sortedNames = [...potentialNames].sort((a, b) => {
        const commonMTG = /the|dragon|spirit|planeswalker|land|creature|sorcery|instant/i;
        if (commonMTG.test(a) && !commonMTG.test(b)) return -1;
        if (!commonMTG.test(a) && commonMTG.test(b)) return 1;
        return b.length - a.length; // Por defecto, la más larga
      });

      // Añadir las 3 mejores sospechas a las queries
      sortedNames.slice(0, 3).forEach(name => {
        // Query exacta (con comillas si tiene espacios)
        if (name.includes(' ')) {
          queries.push(`!"${name}"`); 
        }
        // Query parcial (primeras palabras)
        const parts = name.split(' ');
        if (parts.length > 1) {
          queries.push(parts.slice(0, 3).join(' '));
        } else {
          queries.push(name);
        }
      });

      // Ejecutar búsquedas en orden de precisión
      for (const q of queries) {
        if (!q) continue;
        console.log(`Intentando Query Scryfall: ${q}`);
        try {
          const results = await cardService.searchCards(q);
          if (results && results.data && results.data.length > 0) {
            // Si es una búsqueda exacta (!"nombre"), priorizar
            if (q.startsWith('!')) {
              allResults = [...results.data, ...allResults];
            } else {
              allResults = [...allResults, ...results.data];
            }
            
            // Si encontramos coincidencia exacta o por número, éxito total
            if (q.includes('cn:') || q.startsWith('!')) break;
          }
        } catch (err) {
          // Ignorar errores de 404 de Scryfall
        }
        if (allResults.length >= 5) break;
      }
      
      // Eliminar duplicados por ID
      const uniqueResults = Array.from(new Map(allResults.map(item => [item.id, item])).values());
      setFoundCards(uniqueResults.slice(0, 5));
    } catch (error) {
      console.error('Error general en búsqueda OCR:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Efecto para vincular el stream al elemento de video cuando ambos estén listos
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, cameraActive]);

  // Iniciar cámara
  const startCamera = async () => {
    try {
      // Intentar primero con la cámara trasera (móvil) y alta resolución
      const constraints = {
        video: { 
          facingMode: { ideal: 'environment' }, 
          width: { ideal: 1280 }, 
          height: { ideal: 720 } 
        }
      };
      
      let mediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (e) {
        console.log('Fallo con constraints ideales, intentando básicos...', e);
        // Fallback a cualquier cámara disponible
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
      
      setStream(mediaStream);
      setCameraActive(true);
      setCameraError(false);
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      setCameraError(true);
      setCameraActive(false);
    }
  };

  // Procesar archivo de imagen (Fallback)
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setScanning(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target.result;
        setPreviewUrl(imageData);
        
        // Procesar OCR con Tesseract
        const result = await Tesseract.recognize(imageData, 'eng', {
          logger: (m) => console.log('OCR Progress:', m),
        });

        setRecognizedText(result.data.text);
        setScanning(false);
        // Buscar cartas automáticamente
        searchCardsFromOCR(result.data.text);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error procesando archivo:', error);
      alert('Error al leer el archivo.');
      setScanning(false);
    }
  };

  // Detener cámara
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  // Capturar foto y procesar OCR
  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      setScanning(true);
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);

      const imageData = canvasRef.current.toDataURL('image/jpeg');
      setPreviewUrl(imageData);

      // Procesar OCR con Tesseract
      const result = await Tesseract.recognize(imageData, 'eng', {
        logger: (m) => console.log('OCR Progress:', m),
      });

      const text = result.data.text;
      setRecognizedText(text);
      console.log('Texto reconocido:', text);
      
      // Buscar cartas automáticamente tras el OCR
      searchCardsFromOCR(text);
    } catch (error) {
      console.error('Error en OCR:', error);
      alert('Error al procesar la imagen. Intenta de nuevo.');
    } finally {
      setScanning(false);
    }
  };

  // Función para añadir una carta al inventario (Simulada)
  const addCardToInventory = () => {
    if (!selectedCard) return;

    const newEntry = {
      ...selectedCard,
      quantity: parseInt(quantity),
      uniqueId: Date.now()
    };
    
    setInventory(prev => {
      const updated = [...prev, newEntry];
      console.log('Inventario actualizado:', updated);
      return updated;
    });
    
    closeScanner();
  };

  // Función para preparar la adición de una carta
  const handleSelectCard = (card) => {
    setSelectedCard(card);
    setQuantity(1);
    setPreviewUrl(null); // Ocultamos el preview al confirmar la carta específica
  };

  // Limpiar cámara al cerrar modal
  const closeScanner = () => {
    stopCamera();
    setShowScanner(false);
    setRecognizedText('');
    setFoundCards([]);
    setSelectedCard(null);
    setQuantity(1);
    setPreviewUrl(null);
  };

  useEffect(() => {
    if (showScanner) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [showScanner]);

  return (
    <div className="min-h-screen bg-mtg-gradient py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-mtg-gold-bright font-nexus">
              💎 Mi Inventario
            </h1>
            <p className="text-mtg-text-muted mt-2">v2.0 - Inventory & Scan Edition</p>
          </div>
          <button
            onClick={() => setShowScanner(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Camera className="w-5 h-5" />
            <span>Escanear Carta</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card text-center">
            <div className="text-3xl font-bold text-mtg-gold-bright mb-2">{inventory.length}</div>
            <p className="text-mtg-text-muted">Total de Cartas</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-mtg-gold-bright mb-2">
              {inventory.reduce((acc, card) => acc + (parseFloat(card.prices?.eur || card.prices?.usd || 0) * card.quantity), 0).toFixed(2)}€
            </div>
            <p className="text-mtg-text-muted">Valor Total</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-mtg-gold-bright mb-2">
              {new Set(inventory.map(c => c.name)).size}
            </div>
            <p className="text-mtg-text-muted">Tipos Únicos</p>
          </div>
        </div>

        {/* Inventory Table */}
        {inventory.length > 0 && (
          <div className="card mb-12 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-mtg-gold-bright/20">
                  <th className="py-4 px-2 text-mtg-gold-bright">Carta</th>
                  <th className="py-4 px-2 text-mtg-gold-bright">Cantidad</th>
                  <th className="py-4 px-2 text-mtg-gold-bright">Precio Unit.</th>
                  <th className="py-4 px-2 text-mtg-gold-bright">Total</th>
                  <th className="py-4 px-2 text-mtg-gold-bright">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.uniqueId} className="border-b border-mtg-gold-bright/10 hover:bg-white/5">
                    <td className="py-4 px-2 flex items-center space-x-3">
                      {item.image_uris?.small && <img src={item.image_uris.small} alt={item.name} className="w-8 h-10 object-contain" />}
                      <span>{item.name}</span>
                    </td>
                    <td className="py-4 px-2 font-nexus">{item.quantity}</td>
                    <td className="py-4 px-2">{item.prices?.eur || item.prices?.usd || 0}€</td>
                    <td className="py-4 px-2 text-mtg-gold-bright font-bold">
                      {(parseFloat(item.prices?.eur || item.prices?.usd || 0) * item.quantity).toFixed(2)}€
                    </td>
                    <td className="py-4 px-2">
                      <button 
                        onClick={() => setInventory(inventory.filter(i => i.uniqueId !== item.uniqueId))}
                        className="text-mtg-red hover:text-white transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {inventory.length === 0 && (
          <div className="card text-center py-16">
            <TrendingUp className="w-16 h-16 text-mtg-gold-bright mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-mtg-gold-bright mb-4">
              Tu inventario está vacío
            </h2>
            <p className="text-mtg-text-muted mb-8 max-w-md mx-auto">
              Comienza a añadir cartas a tu colección usando el escáner OCR o subiendo fotos
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => setShowScanner(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Camera className="w-5 h-5" />
                <span>Escanear Cartas</span>
              </button>
            </div>
          </div>
        )}

        {/* Scanner Modal - Placeholder */}
        {showScanner && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="card-premium max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-mtg-gold-bright font-nexus">
                  📷 Escáner OCR de Cartas
                </h2>
                <button
                  onClick={closeScanner}
                  className="text-mtg-text-light hover:text-mtg-gold-bright transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {cameraActive ? (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden border border-mtg-gold-bright/50">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-80 object-cover"
                    />
                    {previewUrl && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <img src={previewUrl} alt="Preview" className="max-h-full object-contain" />
                      </div>
                    )}
                  </div>

                  <canvas
                    ref={canvasRef}
                    className="hidden"
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={captureAndScan}
                      disabled={scanning}
                      className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {scanning ? '🔄 Procesando...' : '📸 Capturar y Escanear'}
                    </button>
                    <button
                      onClick={closeScanner}
                      className="flex-1 btn-secondary"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-mtg-bg-darker rounded-lg p-8 border border-mtg-gold-bright/30 text-center relative overflow-hidden min-h-[200px] flex flex-col justify-center">
                    {previewUrl ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                        <img src={previewUrl} alt="Preview" className="max-h-full object-contain mb-2" />
                        <button 
                          onClick={() => setPreviewUrl(null)}
                          className="bg-black/60 text-white px-3 py-1 rounded-full text-xs hover:bg-mtg-red transition"
                        >
                          Cambiar imagen
                        </button>
                      </div>
                    ) : cameraError ? (
                      <>
                        <div className="text-mtg-red mb-4 text-xl">⚠️ Cámara no disponible</div>
                        <p className="text-mtg-text-light mb-4">
                          El navegador bloquea la cámara por seguridad (HTTP detectado). 
                          Usa <b>HTTPS</b> o sube una foto manualmente para probar el OCR.
                        </p>
                      </>
                    ) : (
                      <>
                        <Camera className="w-12 h-12 text-mtg-gold-bright mx-auto mb-4" />
                        <p className="text-mtg-text-light mb-2">Escáner de Cartas MTG</p>
                        <p className="text-mtg-text-muted text-sm">
                          Utiliza tu cámara o sube una foto para identificar la carta.
                        </p>
                      </>
                    )}
                  </div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="flex flex-col gap-3">
                    {!cameraError && (
                      <button
                        onClick={startCamera}
                        className="w-full btn-primary flex items-center justify-center space-x-2"
                      >
                        <Camera className="w-5 h-5" />
                        <span>Activar Cámara</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={scanning}
                      className="w-full btn-secondary flex items-center justify-center space-x-2"
                    >
                      {scanning ? '🔄 Procesando...' : (
                        <>
                          <Plus className="w-5 h-5" />
                          <span>Subir Foto (.jpg/.png)</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={closeScanner}
                      className="w-full text-mtg-text-muted hover:text-white transition py-2"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {recognizedText && (
                <div className="bg-mtg-bg-darker rounded-lg p-4 border border-mtg-gold-bright/30 mt-4">
                  <p className="text-sm text-mtg-text-muted mb-2">Texto reconocido:</p>
                  <p className="text-mtg-text-light font-mono text-sm break-words max-h-24 overflow-y-auto">
                    {recognizedText}
                  </p>
                </div>
              )}

              {/* Resultados de búsqueda OCR */}
              {(isSearching || foundCards.length > 0) && !selectedCard && (
                <div className="mt-6 border-t border-mtg-gold-bright/20 pt-6">
                  <h3 className="text-lg font-bold text-mtg-gold-bright mb-4 flex items-center">
                    {isSearching ? '🔍 Buscando coincidencias...' : '✨ Cartas detectadas'}
                  </h3>
                  
                  <div className="space-y-3">
                    {foundCards.map((card) => (
                      <div 
                        key={card.id} 
                        className="bg-mtg-bg-dark border border-mtg-gold-bright/20 rounded-lg p-3 flex items-center justify-between hover:border-mtg-gold-bright/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          {card.image_uris?.small && (
                            <img src={card.image_uris.small} alt={card.name} className="w-12 h-16 object-contain rounded" />
                          )}
                          <div>
                            <div className="font-bold text-mtg-text-light">{card.name}</div>
                            <div className="text-xs text-mtg-text-muted">{card.set_name} · {card.prices?.eur || card.prices?.usd || '?'}€</div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleSelectCard(card)}
                          className="bg-mtg-gold-bright text-mtg-black p-2 rounded-full hover:bg-mtg-gold-dark transition-colors"
                          title="Añadir al inventario"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    
                    {!isSearching && foundCards.length === 0 && recognizedText && (
                      <p className="text-mtg-text-muted text-center py-4 italic">
                        No se encontraron cartas exactas. Intenta capturar la imagen más cerca del nombre.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Confirmación y Cantidad */}
              {selectedCard && (
                <div className="mt-6 bg-mtg-blue/20 border border-mtg-gold-bright/30 rounded-lg p-6 animate-fade-in text-center">
                  <h3 className="text-xl font-bold text-mtg-gold-bright mb-4 flex items-center justify-center">
                    <Save className="w-6 h-6 mr-2" /> Confirmar Adición
                  </h3>
                  
                  <div className="flex flex-col items-center mb-6">
                    {selectedCard.image_uris?.normal && (
                      <img src={selectedCard.image_uris.normal} alt={selectedCard.name} className="w-48 h-auto rounded-lg shadow-2xl mb-4 border border-mtg-gold-bright/20" />
                    )}
                    <h4 className="text-lg font-bold text-white">{selectedCard.name}</h4>
                    <p className="text-mtg-text-muted">{selectedCard.set_name}</p>
                  </div>

                  <div className="flex items-center justify-center space-x-6 mb-8">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full border border-mtg-gold-bright text-mtg-gold-bright hover:bg-mtg-gold-bright hover:text-mtg-black transition flex items-center justify-center font-bold text-xl"
                      >
                        -
                      </button>
                      <span className="text-3xl font-bold text-white min-w-[50px]">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-full border border-mtg-gold-bright text-mtg-gold-bright hover:bg-mtg-gold-bright hover:text-mtg-black transition flex items-center justify-center font-bold text-xl"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={addCardToInventory}
                      className="flex-1 btn-primary text-lg py-3"
                    >
                      Añadir al Inventario
                    </button>
                    <button 
                      onClick={() => setSelectedCard(null)}
                      className="flex-1 btn-secondary text-lg py-3"
                    >
                      Volver
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
