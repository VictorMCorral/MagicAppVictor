import React, { useState, useRef, useEffect } from 'react';
import { Camera, TrendingUp, Plus, Trash2, Search, X, Check, Save } from 'lucide-react';
import Tesseract from 'tesseract.js';
import cardService from '../services/cardService';

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [showScanner, setShowScanner] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(false);
  const fileInputRef = useRef(null);

  // Estados para resultados de búsqueda
  const [foundCards, setFoundCards] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Placeholder para demostración
  const demoCards = [
    { id: 1, name: 'Black Lotus', quantity: 1, price: 8500, edition: 'Alpha' },
    { id: 2, name: 'Mox Sapphire', quantity: 1, price: 6500, edition: 'Beta' },
    { id: 3, name: 'Counterspell', quantity: 4, price: 45, edition: 'Revised' },
  ];

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
        .filter(l => l.length > 3);
      
      // Limpiamos ruidos del OCR (caracteres raros al inicio y fin)
      const cleanPossibleNames = lines.map(line => {
        return line
          .replace(/^[^a-zA-Z0-9]+/, '') // Quitar símbolos raros al inicio
          .replace(/[^a-zA-Z0-9\s,']+/g, ' ') // Cambiar basura interna por espacio
          .trim();
      }).filter(n => n.length > 3);

      let allResults = [];
      let queries = [];

      // Query 1: Combinación ganadora (Nombre + Número)
      if (cleanPossibleNames.length > 0 && collectorNumber) {
        // Tomamos palabras clave del nombre para evitar que basura al final bloquee la búsqueda
        const nameKey = cleanPossibleNames[0].split(' ').slice(0, 4).join(' ');
        queries.push(`"${nameKey}" cn:${collectorNumber}`);
      }

      // Query 2: Solo Nombre (Fuzzy)
      if (cleanPossibleNames.length > 0) {
        const nameKey = cleanPossibleNames[0].split(' ').slice(0, 5).join(' ');
        queries.push(`${nameKey}`);
      }

      // Query 3: Segunda línea (a veces el nombre está ahí)
      if (cleanPossibleNames.length > 1) {
        queries.push(`${cleanPossibleNames[1]}`);
      }

      // Ejecutar búsquedas en orden de precisión
      for (const q of queries) {
        console.log(`Intentando Query Scryfall: ${q}`);
        try {
          const results = await cardService.searchCards(q);
          if (results && results.data && results.data.length > 0) {
            allResults = [...allResults, ...results.data];
            // Si encontramos por nombre + número, tenemos la carta exacta. Paramos.
            if (q.includes('cn:')) break;
          }
        } catch (err) {
          console.error(`Fallo query: ${q}`);
        }
        if (allResults.length >= 3) break;
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
  const addCardToInventory = (card) => {
    const newEntry = {
      ...card,
      quantity: 1,
      uniqueId: Date.now()
    };
    setInventory([...inventory, newEntry]);
    alert(`${card.name} añadida al inventario.`);
    closeScanner();
  };

  // Limpiar cámara al cerrar modal
  const closeScanner = () => {
    stopCamera();
    setShowScanner(false);
    setRecognizedText('');
    setFoundCards([]);
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
            <div className="text-3xl font-bold text-mtg-gold-bright mb-2">0</div>
            <p className="text-mtg-text-muted">Total de Cartas</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-mtg-gold-bright mb-2">0€</div>
            <p className="text-mtg-text-muted">Valor Total</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-mtg-gold-bright mb-2">0</div>
            <p className="text-mtg-text-muted">Tipos Únicos</p>
          </div>
        </div>

        {/* Empty State */}
        <div className="card text-center py-16">
          <TrendingUp className="w-16 h-16 text-mtg-gold-bright mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-mtg-gold-bright mb-4">
            Tu inventario está vacío
          </h2>
          <p className="text-mtg-text-muted mb-8 max-w-md mx-auto">
            Comienza a añadir cartas a tu colección usando el escáner OCR o importa desde un archivo
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => setShowScanner(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Camera className="w-5 h-5" />
              <span>Escanear Cartas</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Añadir Manual</span>
            </button>
          </div>
        </div>

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
                  <div className="bg-mtg-bg-darker rounded-lg p-8 border border-mtg-gold-bright/30 text-center">
                    {cameraError ? (
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
              {(isSearching || foundCards.length > 0) && (
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
                          onClick={() => addCardToInventory(card)}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
