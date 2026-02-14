import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { Camera, TrendingUp, Plus, Trash2, X, Save } from 'lucide-react';
import Tesseract from 'tesseract.js';
import cardService from '../services/cardService';

const SAMPLE_INVENTORY = [
  {
    uniqueId: 1001,
    name: 'Lightning Bolt',
    quantity: 4,
    prices: { eur: '2.20', usd: '2.45' },
    set_name: 'Magic 2010',
    image_uris: {
      small: 'https://cards.scryfall.io/small/front/f/e/fef3b4b1-2d8d-4ff6-ac6d-ad52fbf8df1f.jpg'
    }
  },
  {
    uniqueId: 1002,
    name: 'Counterspell',
    quantity: 2,
    prices: { eur: '1.80', usd: '2.00' },
    set_name: 'Dominaria United Commander',
    image_uris: {
      small: 'https://cards.scryfall.io/small/front/1/b/1b27f084-a62d-4e3a-8308-a335a45da76a.jpg'
    }
  },
  {
    uniqueId: 1003,
    name: 'Sol Ring',
    quantity: 1,
    prices: { eur: '1.40', usd: '1.55' },
    set_name: 'Commander Masters',
    image_uris: {
      small: 'https://cards.scryfall.io/small/front/0/3/03f85e19-4d4a-4ac9-b3b6-c17ec79c6a7b.jpg'
    }
  }
];

const parseImageUris = (imageUrisData, imageUrl) => {
  if (!imageUrisData) {
    if (imageUrl) {
      return { small: imageUrl, normal: imageUrl };
    }
    return null;
  }
  if (typeof imageUrisData === 'string') {
    try {
      return JSON.parse(imageUrisData);
    } catch {
      return imageUrl ? { small: imageUrl, normal: imageUrl } : null;
    }
  }
  return imageUrisData;
};

// Generar URL de imagen de Scryfall basada en el nombre de la carta
const getScryfallImageUrl = (cardName) => {
  if (!cardName) return null;
  const encodedName = encodeURIComponent(cardName);
  return `https://api.scryfall.com/cards/named?fuzzy=${encodedName}&format=image&version=small`;
};

const InventoryPage = () => {
  // Inicializar inventario desde localStorage
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('mtg_inventory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (error) {
        console.warn('Inventario guardado inválido, cargando datos de ejemplo.');
      }
    }
    return process.env.NODE_ENV === 'test' ? [] : SAMPLE_INVENTORY;
  });
  
  const [showScanner, setShowScanner] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(false);
  const [cameraErrorMessage, setCameraErrorMessage] = useState('');
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
      const cnMatch = text.match(/(\d{1,4})\/(\d{1,4})/);
      const collectorNumber = cnMatch ? cnMatch[1] : null;

      const lines = text.split('\n')
        .map(l => l.trim())
        .filter(l => l.length >= 2);
      
      const potentialNames = lines.map(line => {
        return line
          .replace(/^[^a-zA-Z]+/, '')
          .replace(/[^a-zA-Z0-9\s,']+/g, ' ')
          .trim();
      }).filter(n => n.length > 3 && /[a-zA-Z]/.test(n));

      let allResults = [];
      let queries = [];

      if (potentialNames.length > 0 && collectorNumber) {
        const nameKey = potentialNames[0].split(' ').slice(0, 3).join(' ');
        queries.push(`"${nameKey}" cn:${collectorNumber}`);
      }

      const sortedNames = [...potentialNames].sort((a, b) => {
        const commonMTG = /the|dragon|spirit|planeswalker|land|creature|sorcery|instant/i;
        if (commonMTG.test(a) && !commonMTG.test(b)) return -1;
        if (!commonMTG.test(a) && commonMTG.test(b)) return 1;
        return b.length - a.length;
      });

      sortedNames.slice(0, 3).forEach(name => {
        if (name.includes(' ')) {
          queries.push(`!"${name}"`); 
        }
        const parts = name.split(' ');
        if (parts.length > 1) {
          queries.push(parts.slice(0, 3).join(' '));
        } else {
          queries.push(name);
        }
      });

      for (const q of queries) {
        if (!q) continue;
        console.log(`Intentando Query Scryfall: ${q}`);
        try {
          const results = await cardService.searchCards(q);
          if (results && results.data && results.data.length > 0) {
            if (q.startsWith('!')) {
              allResults = [...results.data, ...allResults];
            } else {
              allResults = [...allResults, ...results.data];
            }
            
            if (q.includes('cn:') || q.startsWith('!')) break;
          }
        } catch (err) {
          // Ignorar errores de 404 de Scryfall
        }
        if (allResults.length >= 5) break;
      }
      
      const uniqueResults = Array.from(new Map(allResults.map(item => [item.id, item])).values());
      setFoundCards(uniqueResults.slice(0, 5));
    } catch (error) {
      console.error('Error general en búsqueda OCR:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Efecto para vincular el stream al elemento de video
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play?.().catch((error) => {
        console.warn('No se pudo iniciar reproducción de video automáticamente:', error);
      });
    }
  }, [stream, cameraActive]);

  // Iniciar cámara
  const startCamera = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('MEDIA_DEVICES_NO_DISPONIBLE');
      }

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
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
      
      setStream(mediaStream);
      setCameraActive(true);
      setCameraError(false);
      setCameraErrorMessage('');
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      let message = 'No se pudo abrir la cámara en este dispositivo.';

      if (error?.message === 'MEDIA_DEVICES_NO_DISPONIBLE') {
        message = 'Tu navegador no soporta acceso a cámara desde esta página. Prueba con Chrome, Edge o Firefox actualizados.';
      } else if (error?.name === 'NotAllowedError' || error?.name === 'PermissionDeniedError') {
        message = 'No diste permiso de cámara. Habilita el permiso del sitio en el navegador e inténtalo de nuevo.';
      } else if (error?.name === 'NotFoundError' || error?.name === 'DevicesNotFoundError') {
        message = 'No se detectó ninguna cámara conectada.';
      } else if (error?.name === 'NotReadableError' || error?.name === 'TrackStartError') {
        message = 'La cámara está siendo usada por otra aplicación. Cierra Zoom/Meet/Teams y vuelve a intentar.';
      } else if (error?.name === 'OverconstrainedError' || error?.name === 'ConstraintNotSatisfiedError') {
        message = 'No se pudo iniciar con la configuración actual de cámara. Intenta nuevamente con otra cámara.';
      } else if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        message = 'La cámara requiere HTTPS fuera de localhost. Abre la app con https para habilitarla.';
      }

      setCameraErrorMessage(message);
      setCameraError(true);
      setCameraActive(false);
    }
  }, []);

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
        
        const result = await Tesseract.recognize(imageData, 'eng', {
          logger: (m) => console.log('OCR Progress:', m),
        });

        setRecognizedText(result.data.text);
        setScanning(false);
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
  const stopCamera = useCallback(() => {
    setStream((currentStream) => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
      return null;
    });
    setCameraActive(false);
  }, []);

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

      const result = await Tesseract.recognize(imageData, 'eng', {
        logger: (m) => console.log('OCR Progress:', m),
      });

      const text = result.data.text;
      setRecognizedText(text);
      console.log('Texto reconocido:', text);
      
      searchCardsFromOCR(text);
    } catch (error) {
      console.error('Error en OCR:', error);
      alert('Error al procesar la imagen. Intenta de nuevo.');
    } finally {
      setScanning(false);
    }
  };

  // Función para añadir una carta al inventario
  const addCardToInventory = () => {
    if (!selectedCard) return;

    const normalizedCard = {
      ...selectedCard,
      quantity: parseInt(quantity),
      uniqueId: Date.now()
    };

    if (!normalizedCard.imageUrl && normalizedCard.image_uris?.small) {
      normalizedCard.imageUrl = normalizedCard.image_uris.small;
    }
    
    setInventory(prev => {
      const updated = [...prev, normalizedCard];
      console.log('Inventario actualizado:', updated);
      return updated;
    });
    
    closeScanner();
  };

  // Función para preparar la adición de una carta
  const handleSelectCard = (card) => {
    setSelectedCard(card);
    setQuantity(1);
    setPreviewUrl(null);
  };

  // Limpiar cámara al cerrar modal
  const closeScanner = useCallback(() => {
    stopCamera();
    setShowScanner(false);
    setRecognizedText('');
    setFoundCards([]);
    setSelectedCard(null);
    setQuantity(1);
    setPreviewUrl(null);
    setCameraError(false);
    setCameraErrorMessage('');
  }, [stopCamera]);

  useEffect(() => {
    if (showScanner) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [showScanner, startCamera, stopCamera]);

  // Calcular estadísticas
  const totalCards = inventory.length;
  const totalValue = inventory.reduce((acc, card) => acc + (parseFloat(card.prices?.eur || card.prices?.usd || 0) * card.quantity), 0).toFixed(2);
  const uniqueTypes = new Set(inventory.map(c => c.name)).size;

  return (
    <div className="min-vh-100 py-4" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)' }}>
      <Container>
        {/* Header */}
        <Row className="mb-5 align-items-center">
          <Col>
            <h1 className="display-5 fw-bold" style={{ color: 'var(--mtg-gold-bright)' }}>
              💎 Mi Inventario
            </h1>
            <p className="text-muted">v2.0 - Inventory & Scan Edition</p>
          </Col>
          <Col xs="auto">
            <Button 
              className="btn-mtg-primary d-flex align-items-center gap-2"
              onClick={() => setShowScanner(true)}
            >
              <Camera size={20} />
              <span>Escanear Carta</span>
            </Button>
          </Col>
        </Row>

        {/* Stats */}
        <Row className="g-4 mb-5">
          <Col md={4}>
            <Card className="stats-card text-center h-100">
              <Card.Body>
                <div className="display-6 fw-bold mb-2" style={{ color: 'var(--mtg-gold-bright)' }}>
                  {totalCards}
                </div>
                <p className="text-muted mb-0">Total de Cartas</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stats-card text-center h-100">
              <Card.Body>
                <div className="display-6 fw-bold mb-2" style={{ color: 'var(--mtg-gold-bright)' }}>
                  {totalValue}€
                </div>
                <p className="text-muted mb-0">Valor Total</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stats-card text-center h-100">
              <Card.Body>
                <div className="display-6 fw-bold mb-2" style={{ color: 'var(--mtg-gold-bright)' }}>
                  {uniqueTypes}
                </div>
                <p className="text-muted mb-0">Tipos Únicos</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Inventory Grid */}
        {inventory.length > 0 && (
          <Row xs={2} sm={3} md={4} lg={5} xl={6} className="g-4">
            {inventory.map((item) => {
              const imageUris = parseImageUris(item.image_uris, item.imageUrl);
              const price = parseFloat(item.prices?.eur || item.prices?.usd || 0);
              const imageSource = imageUris?.small || item.imageUrl || getScryfallImageUrl(item.name);
              
              return (
                <Col key={item.uniqueId}>
                  <Card className="inventory-card-item h-100 position-relative">
                    {/* Cantidad Badge */}
                    <Badge 
                      bg="warning" 
                      text="dark" 
                      className="position-absolute fw-bold px-2 py-1"
                      style={{ top: '-8px', left: '-8px', zIndex: 10 }}
                    >
                      {item.quantity}x
                    </Badge>
                    
                    {/* Imagen */}
                    <div 
                      className="position-relative overflow-hidden rounded-top"
                      style={{ aspectRatio: '63/88', background: 'linear-gradient(to bottom, #374151, #1f2937)' }}
                    >
                      {imageSource ? (
                        <Card.Img 
                          variant="top"
                          src={imageSource} 
                          alt={item.name} 
                          className="w-100 h-100"
                          style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
                          loading="lazy"
                          onError={(e) => {
                            const scryfallUrl = getScryfallImageUrl(item.name);
                            if (e.target.src !== scryfallUrl) {
                              e.target.src = scryfallUrl;
                            } else {
                              e.target.onerror = null;
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMjMiIGhlaWdodD0iMzExIiB2aWV3Qm94PSIwIDAgMjIzIDMxMSI+PHJlY3QgZmlsbD0iIzFhMWExYSIgd2lkdGg9IjIyMyIgaGVpZ2h0PSIzMTEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2Q0YWYzNyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPk1URzwvdGV4dD48L3N2Zz4=';
                            }
                          }}
                        />
                      ) : (
                        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                          <span className="fw-bold" style={{ color: 'var(--mtg-gold-bright)' }}>MTG</span>
                        </div>
                      )}
                    </div>
                    
                    <Card.Body className="p-2">
                      {/* Info */}
                      <Card.Title 
                        className="fs-6 fw-bold text-truncate mb-1"
                        style={{ color: 'var(--mtg-text-light)' }}
                        title={item.name}
                      >
                        {item.name}
                      </Card.Title>
                      <Card.Text 
                        className="small text-muted text-truncate fst-italic mb-2"
                        title={item.set_name}
                      >
                        {item.set_name || 'Set desconocido'}
                      </Card.Text>
                      
                      {/* Precio y Acciones */}
                      <div className="d-flex align-items-center justify-content-between pt-2 border-top" style={{ borderColor: 'rgba(212, 175, 55, 0.2) !important' }}>
                        {price > 0 ? (
                          <span className="fw-bold small" style={{ color: 'var(--mtg-gold-bright)' }}>
                            €{(price * item.quantity).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-muted small">Sin precio</span>
                        )}
                        
                        <Button 
                          variant="danger"
                          size="sm"
                          className="p-1 opacity-75"
                          onClick={() => setInventory(inventory.filter(i => i.uniqueId !== item.uniqueId))}
                          title="Eliminar carta"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        {/* Empty State */}
        {inventory.length === 0 && (
          <Card className="card-mtg text-center py-5">
            <Card.Body>
              <TrendingUp size={64} className="mb-4" style={{ color: 'var(--mtg-gold-bright)' }} />
              <h2 className="h3 fw-bold mb-3" style={{ color: 'var(--mtg-gold-bright)' }}>
                Tu inventario está vacío
              </h2>
              <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '400px' }}>
                Comienza a añadir cartas a tu colección usando el escáner OCR o subiendo fotos
              </p>
              <Button 
                className="btn-mtg-primary d-inline-flex align-items-center gap-2"
                onClick={() => setShowScanner(true)}
              >
                <Camera size={20} />
                <span>Escanear Cartas</span>
              </Button>
            </Card.Body>
          </Card>
        )}

        {/* Scanner Modal */}
        <Modal 
          show={showScanner} 
          onHide={closeScanner} 
          size="lg" 
          centered
          contentClassName="card-mtg-premium"
        >
          <Modal.Header className="border-0">
            <Modal.Title className="fw-bold" style={{ color: 'var(--mtg-gold-bright)' }}>
              📷 Escáner OCR de Cartas
            </Modal.Title>
            <Button 
              variant="link" 
              className="p-0 text-decoration-none"
              onClick={closeScanner}
              style={{ color: 'var(--mtg-text-light)' }}
            >
              <X size={24} />
            </Button>
          </Modal.Header>
          
          <Modal.Body>
            {cameraActive ? (
              <div>
                <div className="position-relative rounded overflow-hidden mb-3" style={{ border: '1px solid rgba(212, 175, 55, 0.5)', background: '#000' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-100"
                    style={{ height: '320px', objectFit: 'cover' }}
                  />
                  {previewUrl && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
                      <img src={previewUrl} alt="Preview" style={{ maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                  )}
                </div>

                <canvas ref={canvasRef} className="d-none" />

                <div className="d-flex gap-2">
                  <Button
                    className="btn-mtg-primary flex-grow-1"
                    onClick={captureAndScan}
                    disabled={scanning}
                  >
                    {scanning ? '🔄 Procesando...' : '📸 Capturar y Escanear'}
                  </Button>
                  <Button
                    className="btn-mtg-secondary flex-grow-1"
                    onClick={closeScanner}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div 
                  className="rounded p-5 text-center position-relative overflow-hidden d-flex flex-column justify-content-center"
                  style={{ 
                    background: 'var(--mtg-bg-darker)', 
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    minHeight: '200px'
                  }}
                >
                  {previewUrl ? (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
                      <img src={previewUrl} alt="Preview" style={{ maxHeight: '100%', objectFit: 'contain' }} className="mb-2" />
                      <Button 
                        variant="dark"
                        size="sm"
                        className="rounded-pill"
                        onClick={() => setPreviewUrl(null)}
                      >
                        Cambiar imagen
                      </Button>
                    </div>
                  ) : cameraError ? (
                    <>
                      <div className="text-danger mb-3 fs-4">⚠️ Cámara no disponible</div>
                      <p style={{ color: 'var(--mtg-text-light)' }}>
                        {cameraErrorMessage || 'No fue posible acceder a la cámara. Revisa permisos del navegador y vuelve a intentarlo.'}
                      </p>
                    </>
                  ) : (
                    <>
                      <Camera size={48} className="mx-auto mb-3" style={{ color: 'var(--mtg-gold-bright)' }} />
                      <p style={{ color: 'var(--mtg-text-light)' }} className="mb-1">Escáner de Cartas MTG</p>
                      <p className="text-muted small">
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
                  className="d-none"
                />

                <div className="d-flex flex-column gap-2 mt-3">
                  {!cameraError && (
                    <Button
                      className="btn-mtg-primary d-flex align-items-center justify-content-center gap-2"
                      onClick={startCamera}
                    >
                      <Camera size={20} />
                      <span>Activar Cámara</span>
                    </Button>
                  )}
                  
                  <Button
                    className="btn-mtg-secondary d-flex align-items-center justify-content-center gap-2"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={scanning}
                  >
                    {scanning ? (
                      <>
                        <Spinner size="sm" />
                        <span>Procesando...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={20} />
                        <span>Subir Foto (.jpg/.png)</span>
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="link"
                    className="text-muted"
                    onClick={closeScanner}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {recognizedText && (
              <div 
                className="rounded p-3 mt-3"
                style={{ background: 'var(--mtg-bg-darker)', border: '1px solid rgba(212, 175, 55, 0.3)' }}
              >
                <p className="small text-muted mb-2">Texto reconocido:</p>
                <p 
                  className="font-monospace small mb-0 overflow-auto"
                  style={{ color: 'var(--mtg-text-light)', maxHeight: '100px', wordBreak: 'break-word' }}
                >
                  {recognizedText}
                </p>
              </div>
            )}

            {/* Resultados de búsqueda OCR */}
            {(isSearching || foundCards.length > 0) && !selectedCard && (
              <div className="mt-4 pt-4 border-top" style={{ borderColor: 'rgba(212, 175, 55, 0.2) !important' }}>
                <h5 className="fw-bold mb-3 d-flex align-items-center" style={{ color: 'var(--mtg-gold-bright)' }}>
                  {isSearching ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Buscando coincidencias...
                    </>
                  ) : (
                    '✨ Cartas detectadas'
                  )}
                </h5>
                
                <div className="d-flex flex-column gap-2">
                  {foundCards.map((card) => {
                    const imageUris = parseImageUris(card.image_uris, card.imageUrl);
                    return (
                      <div 
                        key={card.id} 
                        className="d-flex align-items-center justify-content-between p-2 rounded"
                        style={{ 
                          background: 'var(--mtg-bg-dark)', 
                          border: '1px solid rgba(212, 175, 55, 0.2)',
                          transition: 'border-color 0.2s'
                        }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          {imageUris?.small && (
                            <img src={imageUris.small} alt={card.name} className="rounded" style={{ width: '48px', height: '64px', objectFit: 'contain' }} />
                          )}
                          <div>
                            <div className="fw-bold" style={{ color: 'var(--mtg-text-light)' }}>{card.name}</div>
                            <div className="small text-muted">{card.set_name} · {card.prices?.eur || card.prices?.usd || '?'}€</div>
                          </div>
                        </div>
                        <Button 
                          className="btn-mtg-primary rounded-circle p-2"
                          onClick={() => handleSelectCard(card)}
                          title="Añadir al inventario"
                        >
                          <Plus size={20} />
                        </Button>
                      </div>
                    );
                  })}
                  
                  {!isSearching && foundCards.length === 0 && recognizedText && (
                    <p className="text-muted text-center py-3 fst-italic mb-0">
                      No se encontraron cartas exactas. Intenta capturar la imagen más cerca del nombre.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Confirmación y Cantidad */}
            {selectedCard && (
              <div 
                className="mt-4 p-4 rounded text-center"
                style={{ 
                  background: 'rgba(30, 58, 95, 0.3)', 
                  border: '1px solid rgba(212, 175, 55, 0.3)'
                }}
              >
                <h5 className="fw-bold mb-4 d-flex align-items-center justify-content-center gap-2" style={{ color: 'var(--mtg-gold-bright)' }}>
                  <Save size={24} /> Confirmar Adición
                </h5>
                
                <div className="d-flex flex-column align-items-center mb-4">
                  {(() => {
                    const imageUris = parseImageUris(selectedCard.image_uris, selectedCard.imageUrl);
                    return imageUris?.normal ? (
                      <img 
                        src={imageUris.normal} 
                        alt={selectedCard.name} 
                        className="rounded shadow mb-3"
                        style={{ width: '192px', border: '1px solid rgba(212, 175, 55, 0.2)' }}
                      />
                    ) : null;
                  })()}
                  <h4 className="fw-bold text-white mb-1">{selectedCard.name}</h4>
                  <p className="text-muted mb-0">{selectedCard.set_name}</p>
                </div>

                <div className="d-flex align-items-center justify-content-center gap-4 mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <Button 
                      variant="outline-warning"
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: '40px', height: '40px' }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="display-6 fw-bold text-white" style={{ minWidth: '50px' }}>{quantity}</span>
                    <Button 
                      variant="outline-warning"
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: '40px', height: '40px' }}
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <Button 
                    className="btn-mtg-primary flex-grow-1 py-2 fs-5"
                    onClick={addCardToInventory}
                  >
                    Añadir al Inventario
                  </Button>
                  <Button 
                    className="btn-mtg-secondary flex-grow-1 py-2 fs-5"
                    onClick={() => setSelectedCard(null)}
                  >
                    Volver
                  </Button>
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default InventoryPage;
