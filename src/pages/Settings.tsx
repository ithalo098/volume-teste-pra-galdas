import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';
import './styles.css';

function Settings() {
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

      <Link to="/">
        <p className="backButton">
          <svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#ff6f00" transform="rotate(0)">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>back_2_fill</title> <g id="页面-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Arrow" transform="translate(-480.000000, -50.000000)" fillRule="nonzero"> <g id="back_2_fill" transform="translate(480.000000, 50.000000)"> <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" id="MingCute" fillRule="nonzero"> </path> <path d="M7.16075,10.9724 C8.44534,9.45943 10.3615,8.5 12.5,8.5 C16.366,8.5 19.5,11.634 19.5,15.5 C19.5,16.3284 20.1715,17 21,17 C21.8284,17 22.5,16.3284 22.5,15.5 C22.5,9.97715 18.0228,5.5 12.5,5.5 C9.55608,5.5 6.91086,6.77161 5.08155,8.79452 L4.73527,6.83068 C4.59142,6.01484 3.81343,5.47009 2.99759,5.61394 C2.18175,5.7578 1.637,6.53578 1.78085,7.35163 L2.82274,13.2605 C2.89182,13.6523 3.11371,14.0005 3.43959,14.2287 C3.84283,14.5111 4.37354,14.5736 4.82528,14.4305 L10.4693,13.4353 C11.2851,13.2915 11.8299,12.5135 11.686,11.6976 C11.5422,10.8818 10.7642,10.337 9.94833,10.4809 L7.16075,10.9724 Z" id="路径" fill="#ff6f00"> </path> </g> </g> </g> </g>
          </svg>
        </p>
      </Link>

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

export default Settings;
