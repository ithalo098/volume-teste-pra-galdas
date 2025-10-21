import React, { useState, useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import './styles.css';

function Index() {
  const [controlScheme, setControlScheme] = useState('wasd'); // 'wasd' or 'arrows'
  const [pos, setPos] = useState({ x: 90, y: 90 }); // position inside 200x200 preview
  const [activeKeys, setActiveKeys] = useState({ up: false, down: false, left: false, right: false });
  const [masterVolume, setMasterVolume] = useState(100);
  const [musicVolume, setMusicVolume] = useState(80);
  const [sfxVolume, setSfxVolume] = useState(70);
  
  const step = 10;
  const previewSize = 200;
  const playerSize = 20;
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false };
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      const key = e.key;
      let handled = false;

      if (controlScheme === 'wasd') {
        if (key === 'w' || key === 'W') { setActiveKeys(k => ({ ...k, up: true })); handled = true }
        if (key === 's' || key === 'S') { setActiveKeys(k => ({ ...k, down: true })); handled = true }
        if (key === 'a' || key === 'A') { setActiveKeys(k => ({ ...k, left: true })); handled = true }
        if (key === 'd' || key === 'D') { setActiveKeys(k => ({ ...k, right: true })); handled = true }
      } else {
        if (key === 'ArrowUp') { setActiveKeys(k => ({ ...k, up: true })); handled = true }
        if (key === 'ArrowDown') { setActiveKeys(k => ({ ...k, down: true })); handled = true }
        if (key === 'ArrowLeft') { setActiveKeys(k => ({ ...k, left: true })); handled = true }
        if (key === 'ArrowRight') { setActiveKeys(k => ({ ...k, right: true })); handled = true }
      }

      if (handled) {
        e.preventDefault();
        // aplica movimento imediato
        setPos(p => {
          // também considera a tecla atual (quando combinada com a anterior)
          let nx = p.x;
          let ny = p.y;
          if ((key === 'w' || key === 'W' || key === 'ArrowUp') ) ny = Math.max(0, p.y - step);
          if ((key === 's' || key === 'S' || key === 'ArrowDown')) ny = Math.min(previewSize - playerSize, p.y + step);
          if ((key === 'a' || key === 'A' || key === 'ArrowLeft')) nx = Math.max(0, p.x - step);
          if ((key === 'd' || key === 'D' || key === 'ArrowRight')) nx = Math.min(previewSize - playerSize, p.x + step);
          return { x: nx, y: ny };
        });
      }
    };

    const onKeyUp = (e) => {
      const key = e.key;
      if (controlScheme === 'wasd') {
        if (key === 'w' || key === 'W') setActiveKeys(k => ({ ...k, up: false }));
        if (key === 's' || key === 'S') setActiveKeys(k => ({ ...k, down: false }));
        if (key === 'a' || key === 'A') setActiveKeys(k => ({ ...k, left: false }));
        if (key === 'd' || key === 'D') setActiveKeys(k => ({ ...k, right: false }));
      } else {
        if (key === 'ArrowUp') setActiveKeys(k => ({ ...k, up: false }));
        if (key === 'ArrowDown') setActiveKeys(k => ({ ...k, down: false }));
        if (key === 'ArrowLeft') setActiveKeys(k => ({ ...k, left: false }));
        if (key === 'ArrowRight') setActiveKeys(k => ({ ...k, right: false }));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [controlScheme, activeKeys]);

  // pequeno loop para continuar movimentando enquanto segurar (melhora sensação)
  useEffect(() => {
    let raf = null;
    const tick = () => {
      setPos(p => {
        let nx = p.x;
        let ny = p.y;
        if (activeKeys.left) nx = Math.max(0, nx - 2);
        if (activeKeys.right) nx = Math.min(previewSize - playerSize, nx + 2);
        if (activeKeys.up) ny = Math.max(0, ny - 2);
        if (activeKeys.down) ny = Math.min(previewSize - playerSize, ny + 2);
        return nx === p.x && ny === p.y ? p : { x: nx, y: ny };
      });
      raf = requestAnimationFrame(tick);
    };

    if (activeKeys.left || activeKeys.right || activeKeys.up || activeKeys.down) {
      raf = requestAnimationFrame(tick);
    }

    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [activeKeys]);

  return (
    <div className="settings-container centered">
      <h1 className="settings-title">Settings</h1>

      <div className="controls-settings card">
        <div className="scheme-row">
          <label className="scheme-label">Esquema de controle</label>
          <div className="scheme-options">
            <button
              className={`scheme-btn ${controlScheme === 'wasd' ? 'active' : ''}`}
              onClick={() => setControlScheme('wasd')}
            >
              WASD
            </button>
            <button
              className={`scheme-btn ${controlScheme === 'arrows' ? 'active' : ''}`}
              onClick={() => setControlScheme('arrows')}
            >
              Setas
            </button>
          </div>
        </div>

        <p className="helper">Use as teclas <strong>{controlScheme === 'wasd' ? 'W A S D' : 'Setas'}</strong> para mover o quadrado abaixo.</p>

        <div className="preview" style={{ width: previewSize, height: previewSize }}>
          <div
            className="preview-player"
            style={{ left: pos.x, top: pos.y, width: playerSize, height: playerSize }}
          />

          <div className="key-indicators">
            <div className={`key up ${activeKeys.up ? 'on' : ''}`}>{controlScheme === 'wasd' ? 'W' : '↑'}</div>
            <div className={`key left ${activeKeys.left ? 'on' : ''}`}>{controlScheme === 'wasd' ? 'A' : '←'}</div>
            <div className={`key down ${activeKeys.down ? 'on' : ''}`}>{controlScheme === 'wasd' ? 'S' : '↓'}</div>
            <div className={`key right ${activeKeys.right ? 'on' : ''}`}>{controlScheme === 'wasd' ? 'D' : '→'}</div>
          </div>
        </div>

        <p className="position">Posição: <strong>X:</strong> {pos.x} <strong>Y:</strong> {pos.y}</p>
      </div>

      <div className="audio-settings card">
        <h2 className="section-title">Áudio</h2>
        
        <div className="volume-control">
          <div className="volume-label">
            <span>Volume Geral</span>
            <span className="volume-value">{masterVolume}%</span>
          </div>
          <Slider
            value={[masterVolume]}
            onValueChange={(value) => setMasterVolume(value[0])}
            max={100}
            step={1}
            className="volume-slider"
          />
        </div>

        <div className="volume-control">
          <div className="volume-label">
            <span>Música</span>
            <span className="volume-value">{musicVolume}%</span>
          </div>
          <Slider
            value={[musicVolume]}
            onValueChange={(value) => setMusicVolume(value[0])}
            max={100}
            step={1}
            className="volume-slider"
          />
        </div>

        <div className="volume-control">
          <div className="volume-label">
            <span>Efeitos Sonoros</span>
            <span className="volume-value">{sfxVolume}%</span>
          </div>
          <Slider
            value={[sfxVolume]}
            onValueChange={(value) => setSfxVolume(value[0])}
            max={100}
            step={1}
            className="volume-slider"
          />
        </div>
      </div>
    </div>
  );
}

export default Index;
