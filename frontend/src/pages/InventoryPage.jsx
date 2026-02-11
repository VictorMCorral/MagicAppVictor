import React, { useState, useRef, useEffect } from 'react';
import { Camera, TrendingUp, Plus, Trash2, Search, X } from 'lucide-react';
import Tesseract from 'tesseract.js';

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

  // Placeholder para demostración
  const demoCards = [
    { id: 1, name: 'Black Lotus', quantity: 1, price: 8500, edition: 'Alpha' },
    { id: 2, name: 'Mox Sapphire', quantity: 1, price: 6500, edition: 'Beta' },
    { id: 3, name: 'Counterspell', quantity: 4, price: 45, edition: 'Revised' },
  ];

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
        alert(`Texto detectado:\n\n${result.data.text.substring(0, 200)}...`);
        setScanning(false);
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

      // Aquí puedes enviar el texto al servidor para procesar la identificación de la carta
      // por ahora solo mostramos el resultado
      alert(`Texto detectado:\n\n${text.substring(0, 200)}...`);
    } catch (error) {
      console.error('Error en OCR:', error);
      alert('Error al procesar la imagen. Intenta de nuevo.');
    } finally {
      setScanning(false);
    }
  };

  // Limpiar cámara al cerrar modal
  const closeScanner = () => {
    stopCamera();
    setShowScanner(false);
    setRecognizedText('');
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
