import React, { useState } from 'react';
import { Camera, TrendingUp, Plus, Trash2, Search } from 'lucide-react';

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [showScanner, setShowScanner] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder para demostración
  const demoCards = [
    { id: 1, name: 'Black Lotus', quantity: 1, price: 8500, edition: 'Alpha' },
    { id: 2, name: 'Mox Sapphire', quantity: 1, price: 6500, edition: 'Beta' },
    { id: 3, name: 'Counterspell', quantity: 4, price: 45, edition: 'Revised' },
  ];

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
            <div className="card-premium max-w-md w-full">
              <h2 className="text-2xl font-bold text-mtg-gold-bright mb-6 font-nexus">
                📷 Escáner OCR
              </h2>
              <p className="text-mtg-text-light mb-6">
                Esta funcionalidad utilizará Tesseract.js para identificar cartas automáticamente desde tu cámara.
              </p>
              <div className="bg-mtg-bg-darker rounded-lg p-8 mb-6 border border-mtg-gold-bright/30 text-center">
                <Camera className="w-12 h-12 text-mtg-gold-bright mx-auto" />
                <p className="text-mtg-text-muted mt-4">Activar cámara...</p>
              </div>
              <button
                onClick={() => setShowScanner(false)}
                className="w-full btn-secondary"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
