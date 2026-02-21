import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, LogIn, UserPlus, Search, Eye, Layout, Package, 
  Camera, Upload, CheckCircle, Download
} from 'lucide-react';
import './SitemapPage.css';

const SitemapPage = () => {
  const navigate = useNavigate();
  const [hoveredNode, setHoveredNode] = useState(null);

  // Coordenadas exactas del archivo mapa-web.excalidraw
  const nodes = [
    // Nivel 0 - Home
    { id: 'home', name: 'Home', x: 721, y: -70, width: 132, height: 100, color: '#6366f1', path: '/', icon: Home },
    
    // Nivel 1 - Login
    { id: 'login', name: 'Login', x: 718, y: 101, width: 132, height: 100, color: '#8b5cf6', path: '/login', icon: LogIn },
    { id: 'registrarse', name: 'Registrarse', x: 983, y: 105, width: 163, height: 100, color: '#ec4899', path: '/register', icon: UserPlus },
    
    // Nivel 2 - Secciones principales
    { id: 'buscar', name: 'Buscar\nCartas', x: 460, y: 300, width: 132, height: 100, color: '#06b6d4', path: '/cards', icon: Search },
    { id: 'mazos', name: 'Mazos', x: 720, y: 300, width: 132, height: 100, color: '#10b981', path: '/dashboard', icon: Layout },
    { id: 'inventario', name: 'Inventario', x: 1020, y: 300, width: 132, height: 100, color: '#f97316', path: '/inventory', icon: Package },
    
    // Nivel 3 - Subsecciones
    { id: 'visor-carta', name: 'Visor de\nCarta', x: 300, y: 500, width: 132, height: 100, color: '#06b6d4', path: '/cards', icon: Eye },
    { id: 'mazo-detalle', name: 'Mazo\ndetalle', x: 720, y: 500, width: 132, height: 100, color: '#10b981', path: '/dashboard', icon: Eye },
    { id: 'escanear', name: 'Escanear\nCarta', x: 1020, y: 500, width: 132, height: 100, color: '#f97316', path: '/inventory', icon: Camera },
    
    // Nivel 4 - Acciones
    { id: 'exportar', name: 'Exportar', x: 640, y: 700, width: 132, height: 100, color: '#10b981', path: '/dashboard', icon: Upload },
    { id: 'importar', name: 'Importar', x: 800, y: 700, width: 132, height: 100, color: '#10b981', path: '/dashboard', icon: Download },
    { id: 'camara', name: 'Camara', x: 960, y: 700, width: 132, height: 100, color: '#f97316', path: '/inventory', icon: Camera },
    { id: 'subir-imagen', name: 'Subir\nimagen', x: 1120, y: 700, width: 132, height: 100, color: '#f97316', path: '/inventory', icon: Upload },
    
    // Nivel 5 - Final
    { id: 'seleccionar', name: 'Seleccionar\ncarta', x: 1040, y: 860, width: 132, height: 100, color: '#f97316', path: '/inventory', icon: CheckCircle },
  ];

  // Conexiones del Excalidraw
  const connections = [
    { from: 'home', to: 'login' },
    { from: 'login', to: 'registrarse', bidirectional: true },
    { from: 'home', to: 'buscar' },
    { from: 'login', to: 'mazos' },
    { from: 'login', to: 'inventario' },
    { from: 'login', to: 'buscar' },
    { from: 'buscar', to: 'visor-carta' },
    { from: 'mazos', to: 'mazo-detalle' },
    { from: 'mazo-detalle', to: 'buscar', bidirectional: true },
    { from: 'mazo-detalle', to: 'exportar' },
    { from: 'mazo-detalle', to: 'importar' },
    { from: 'inventario', to: 'escanear' },
    { from: 'escanear', to: 'camara' },
    { from: 'escanear', to: 'subir-imagen' },
    { from: 'camara', to: 'seleccionar' },
    { from: 'subir-imagen', to: 'seleccionar' },
    { from: 'seleccionar', to: 'escanear' },
  ];

  const getNodeById = (id) => nodes.find(n => n.id === id);

  const handleNavigate = (path) => {
    if (path) navigate(path);
  };

  // Renderizar línea de conexión con flechas
  const renderConnection = (conn, index) => {
    const fromNode = getNodeById(conn.from);
    const toNode = getNodeById(conn.to);
    
    if (!fromNode || !toNode) return null;

    const x1 = fromNode.x + fromNode.width / 2;
    const y1 = fromNode.y + fromNode.height;
    const x2 = toNode.x + toNode.width / 2;
    const y2 = toNode.y;

    // Calcular punto de control para curva
    const midY = (y1 + y2) / 2;

    return (
      <g key={`${conn.from}-${conn.to}-${index}`}>
        <defs>
          <marker
            id={`arrowhead-${index}`}
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
          </marker>
        </defs>
        <path
          d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
          stroke="#374151"
          strokeWidth="2"
          fill="none"
          strokeOpacity="0.7"
          markerEnd={`url(#arrowhead-${index})`}
        />
      </g>
    );
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: '800', 
          color: 'white',
          textShadow: '0 4px 6px rgba(0,0,0,0.2)',
          marginBottom: '10px'
        }}>
          🗺️ Mapa Web
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.2rem' }}>
          Explora la estructura de navegación de MagicApp
        </p>
      </div>

      {/* Contenedor del diagrama */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        margin: '0 auto', 
        maxWidth: '1400px',
        backgroundColor: 'white',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        padding: '80px 40px 40px',
        overflow: 'hidden'
      }}>
        {/* SVG para las líneas */}
        <svg
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '1100px',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {connections.map((conn, i) => renderConnection(conn, i))}
        </svg>

        {/* Nodos */}
        <div style={{ position: 'relative', height: '1050px', zIndex: 1 }}>
          {nodes.map(node => {
            const Icon = node.icon;
            const isHovered = hoveredNode === node.id;

            return (
              <div
                key={node.id}
                onClick={() => handleNavigate(node.path)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  position: 'absolute',
                  left: `${node.x}px`,
                  top: `${node.y + 100}px`,
                  width: `${node.width}px`,
                  height: `${node.height}px`,
                  background: isHovered 
                    ? `linear-gradient(135deg, ${node.color} 0%, ${node.color}dd 100%)`
                    : `linear-gradient(135deg, ${node.color}ee 0%, ${node.color}cc 100%)`,
                  borderRadius: '16px',
                  border: '3px solid rgba(255,255,255,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isHovered 
                    ? `0 20px 40px ${node.color}50, 0 0 0 4px ${node.color}30`
                    : `0 8px 20px ${node.color}30`,
                  transform: isHovered ? 'translateY(-8px) scale(1.05)' : 'translateY(0) scale(1)',
                }}
              >
                <Icon 
                  size={28} 
                  color="white" 
                  style={{ 
                    marginBottom: '6px',
                    filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))'
                  }} 
                />
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'white',
                    textAlign: 'center',
                    lineHeight: '1.2',
                    whiteSpace: 'pre-line',
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}
                >
                  {node.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leyenda de colores */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '30px', 
        marginTop: '40px',
        flexWrap: 'wrap'
      }}>
        {[
          { color: '#6366f1', label: 'Inicio' },
          { color: '#8b5cf6', label: 'Autenticación' },
          { color: '#06b6d4', label: 'Búsqueda' },
          { color: '#10b981', label: 'Mazos' },
          { color: '#f97316', label: 'Inventario' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              borderRadius: '4px', 
              backgroundColor: item.color,
              boxShadow: `0 2px 4px ${item.color}50`
            }} />
            <span style={{ color: 'white', fontWeight: '500' }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '30px', color: 'rgba(255,255,255,0.7)' }}>
        <p>Haz clic en cualquier nodo para navegar a esa sección</p>
      </div>
    </div>
  );
};

export default SitemapPage;
