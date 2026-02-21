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

  // ViewBox dimensions para escalar todo proporcionalmente
  const VIEWBOX_WIDTH = 1400;
  const VIEWBOX_HEIGHT = 1100;
  const NODE_OFFSET_Y = 100;

  // Coordenadas exactas del archivo mapa-web.excalidraw
  const nodes = [
    // Nivel 0 - Home
    { id: 'home', name: 'Home', x: 721, y: -70, width: 132, height: 100, color: '#6366f1', path: '/', icon: Home },
    
    // Nivel 1 - Login
    { id: 'login', name: 'Login', x: 718, y: 101, width: 132, height: 100, color: '#8b5cf6', path: '/login', icon: LogIn },
    { id: 'registrarse', name: 'Registrarse', x: 983, y: 105, width: 163, height: 100, color: '#ec4899', path: '/register', icon: UserPlus },
    
    // Nivel 2 - Secciones principales
    { id: 'buscar', name: 'Buscar Cartas', x: 460, y: 300, width: 132, height: 100, color: '#06b6d4', path: '/cards', icon: Search },
    { id: 'mazos', name: 'Mazos', x: 720, y: 300, width: 132, height: 100, color: '#10b981', path: '/dashboard', icon: Layout },
    { id: 'inventario', name: 'Inventario', x: 1020, y: 300, width: 132, height: 100, color: '#f97316', path: '/inventory', icon: Package },
    
    // Nivel 3 - Subsecciones
    { id: 'visor-carta', name: 'Visor de Carta', x: 300, y: 500, width: 132, height: 100, color: '#06b6d4', path: '/cards', icon: Eye },
    { id: 'mazo-detalle', name: 'Mazo detalle', x: 720, y: 500, width: 132, height: 100, color: '#10b981', path: '/dashboard', icon: Eye },
    { id: 'escanear', name: 'Escanear Carta', x: 1020, y: 500, width: 132, height: 100, color: '#f97316', path: '/inventory', icon: Camera },
    
    // Nivel 4 - Acciones
    { id: 'exportar', name: 'Exportar', x: 640, y: 700, width: 132, height: 100, color: '#10b981', path: '/dashboard', icon: Upload },
    { id: 'importar', name: 'Importar', x: 800, y: 700, width: 132, height: 100, color: '#10b981', path: '/dashboard', icon: Download },
    { id: 'camara', name: 'Camara', x: 960, y: 700, width: 132, height: 100, color: '#f97316', path: '/inventory', icon: Camera },
    { id: 'subir-imagen', name: 'Subir imagen', x: 1120, y: 700, width: 132, height: 100, color: '#f97316', path: '/inventory', icon: Upload },
    
    // Nivel 5 - Final
    { id: 'seleccionar', name: 'Seleccionar carta', x: 1040, y: 860, width: 132, height: 100, color: '#f97316', path: '/inventory', icon: CheckCircle },
  ];

  // Conexiones del Excalidraw (con tipos para determinar dirección)
  const connections = [
    { from: 'home', to: 'login' },
    { from: 'login', to: 'registrarse', type: 'horizontal-right' },
    { from: 'registrarse', to: 'login', type: 'horizontal-left' },
    { from: 'home', to: 'buscar' },
    { from: 'login', to: 'mazos' },
    { from: 'login', to: 'inventario' },
    { from: 'login', to: 'buscar' },
    { from: 'buscar', to: 'visor-carta' },
    { from: 'mazos', to: 'mazo-detalle' },
    { from: 'mazo-detalle', to: 'buscar', type: 'return-up' },
    { from: 'mazo-detalle', to: 'exportar' },
    { from: 'mazo-detalle', to: 'importar' },
    { from: 'inventario', to: 'escanear' },
    { from: 'escanear', to: 'camara' },
    { from: 'escanear', to: 'subir-imagen' },
    { from: 'camara', to: 'seleccionar' },
    { from: 'subir-imagen', to: 'seleccionar' },
    { from: 'seleccionar', to: 'escanear', type: 'return-curve' },
  ];

  const getNodeById = (id) => nodes.find(n => n.id === id);

  const handleNavigate = (path) => {
    if (path) navigate(path);
  };

  // Calcular punto de conexión según la dirección
  const getConnectionPoint = (node, side) => {
    const y = node.y + NODE_OFFSET_Y;
    switch (side) {
      case 'top':
        return { x: node.x + node.width / 2, y: y };
      case 'bottom':
        return { x: node.x + node.width / 2, y: y + node.height };
      case 'left':
        return { x: node.x, y: y + node.height / 2 };
      case 'right':
        return { x: node.x + node.width, y: y + node.height / 2 };
      default:
        return { x: node.x + node.width / 2, y: y + node.height };
    }
  };

  // Determinar qué lado usar según la posición relativa
  const getConnectionSides = (from, to, connType) => {
    if (connType === 'horizontal-right') return { fromSide: 'right', toSide: 'left' };
    if (connType === 'horizontal-left') return { fromSide: 'left', toSide: 'right' };
    if (connType === 'return-up') return { fromSide: 'top', toSide: 'bottom' };
    
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    
    if (Math.abs(dy) < 50) {
      return dx > 0 
        ? { fromSide: 'right', toSide: 'left' }
        : { fromSide: 'left', toSide: 'right' };
    }
    
    if (dy > 0) {
      return { fromSide: 'bottom', toSide: 'top' };
    }
    
    return { fromSide: 'top', toSide: 'bottom' };
  };

  // Renderizar conexión SVG
  const renderConnection = (conn, index) => {
    const fromNode = getNodeById(conn.from);
    const toNode = getNodeById(conn.to);
    
    if (!fromNode || !toNode) return null;

    const sides = getConnectionSides(fromNode, toNode, conn.type);
    const start = getConnectionPoint(fromNode, sides.fromSide);
    const end = getConnectionPoint(toNode, sides.toSide);

    let pathD;
    
    if (conn.from === 'seleccionar' && conn.to === 'escanear') {
      const rightStart = getConnectionPoint(fromNode, 'right');
      const rightEnd = getConnectionPoint(toNode, 'right');
      const curveOffset = 140;
      pathD = `M ${rightStart.x} ${rightStart.y} C ${rightStart.x + curveOffset} ${rightStart.y}, ${rightEnd.x + curveOffset} ${rightEnd.y}, ${rightEnd.x} ${rightEnd.y}`;
    }
    else if (conn.from === 'mazo-detalle' && conn.to === 'buscar') {
      const leftStart = getConnectionPoint(fromNode, 'left');
      const rightEnd = getConnectionPoint(toNode, 'right');
      const curveOffset = 80;
      pathD = `M ${leftStart.x} ${leftStart.y} C ${leftStart.x - curveOffset} ${leftStart.y - 50}, ${rightEnd.x + curveOffset} ${rightEnd.y + 50}, ${rightEnd.x} ${rightEnd.y}`;
    }
    else if (sides.fromSide === 'right' && sides.toSide === 'left') {
      const midX = (start.x + end.x) / 2;
      pathD = `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;
    }
    else if (sides.fromSide === 'left' && sides.toSide === 'right') {
      const midX = (start.x + end.x) / 2;
      pathD = `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;
    }
    else {
      const midY = (start.y + end.y) / 2;
      pathD = `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;
    }

    return (
      <path
        key={`${conn.from}-${conn.to}-${index}`}
        d={pathD}
        stroke="#374151"
        strokeWidth="2"
        fill="none"
        strokeOpacity="0.7"
        markerEnd="url(#arrowhead)"
      />
    );
  };

  // Renderizar nodo SVG
  const renderNode = (node) => {
    const isHovered = hoveredNode === node.id;
    const y = node.y + NODE_OFFSET_Y;
    
    return (
      <g 
        key={node.id}
        onClick={() => handleNavigate(node.path)}
        onMouseEnter={() => setHoveredNode(node.id)}
        onMouseLeave={() => setHoveredNode(null)}
        style={{ cursor: 'pointer' }}
      >
        {/* Sombra */}
        <rect
          x={node.x + 4}
          y={y + 4}
          width={node.width}
          height={node.height}
          rx="16"
          fill="rgba(0,0,0,0.15)"
        />
        {/* Nodo principal */}
        <rect
          x={node.x}
          y={y}
          width={node.width}
          height={node.height}
          rx="16"
          fill={node.color}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="3"
          style={{
            filter: isHovered ? 'brightness(1.1)' : 'none',
            transition: 'all 0.2s ease'
          }}
        />
        {/* Icono (círculo simplificado) */}
        <circle
          cx={node.x + node.width / 2}
          cy={y + 35}
          r="14"
          fill="rgba(255,255,255,0.2)"
        />
        {/* Texto */}
        <text
          x={node.x + node.width / 2}
          y={y + node.height / 2 + 18}
          textAnchor="middle"
          fill="white"
          fontSize="13"
          fontWeight="700"
          style={{ 
            fontFamily: "'Inter', sans-serif",
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}
        >
          {node.name.split(' ').map((word, i) => (
            <tspan key={i} x={node.x + node.width / 2} dy={i === 0 ? 0 : 15}>
              {word}
            </tspan>
          ))}
        </text>
      </g>
    );
  };

  return (
    <div className="sitemap-page">
      {/* Header */}
      <div className="sitemap-header">
        <h1>🗺️ Mapa Web</h1>
        <p>Explora la estructura de navegación de MagicApp</p>
      </div>

      {/* Contenedor del diagrama - responsive */}
      <div className="sitemap-container">
        <svg
          viewBox={`200 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          className="sitemap-svg"
        >
          {/* Definición de flecha */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
            </marker>
          </defs>
          
          {/* Conexiones */}
          {connections.map((conn, i) => renderConnection(conn, i))}
          
          {/* Nodos */}
          {nodes.map(node => renderNode(node))}
        </svg>
      </div>

      {/* Leyenda de colores */}
      <div className="sitemap-legend">
        {[
          { color: '#6366f1', label: 'Inicio' },
          { color: '#8b5cf6', label: 'Autenticación' },
          { color: '#06b6d4', label: 'Búsqueda' },
          { color: '#10b981', label: 'Mazos' },
          { color: '#f97316', label: 'Inventario' },
        ].map(item => (
          <div key={item.label} className="legend-item">
            <div className="legend-color" style={{ backgroundColor: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="sitemap-footer">
        <p>Haz clic en cualquier nodo para navegar a esa sección</p>
      </div>
    </div>
  );
};

export default SitemapPage;
