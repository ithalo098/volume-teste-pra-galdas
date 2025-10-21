import { useState } from 'react';
import { Slider } from '@/components/ui/slider';

const Index = () => {
  const [masterVolume, setMasterVolume] = useState(100);
  const [musicVolume, setMusicVolume] = useState(80);
  const [sfxVolume, setSfxVolume] = useState(70);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-4xl font-bold text-center">Controles de Áudio</h1>
        
        <div className="bg-card border border-border rounded-lg p-6 shadow-lg space-y-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-foreground">Volume Geral</span>
              <span className="text-primary font-semibold min-w-[45px] text-right">{masterVolume}%</span>
            </div>
            <Slider
              value={[masterVolume]}
              onValueChange={(value) => setMasterVolume(value[0])}
              max={100}
              step={1}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-foreground">Música</span>
              <span className="text-primary font-semibold min-w-[45px] text-right">{musicVolume}%</span>
            </div>
            <Slider
              value={[musicVolume]}
              onValueChange={(value) => setMusicVolume(value[0])}
              max={100}
              step={1}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-foreground">Efeitos Sonoros</span>
              <span className="text-primary font-semibold min-w-[45px] text-right">{sfxVolume}%</span>
            </div>
            <Slider
              value={[sfxVolume]}
              onValueChange={(value) => setSfxVolume(value[0])}
              max={100}
              step={1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
