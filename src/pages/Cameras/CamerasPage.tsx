import { useState, useEffect, useRef } from 'react';
import styles from './CamerasPage.module.css';

interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  ipAddress: string;
  model: string;
}

export default function CamerasPage() {
  const [cameras, setCameras] = useState<Camera[]>([
    { id: '01', name: 'CAM-01', location: 'Cổng chính (Main Gate)', status: 'online', ipAddress: '192.168.1.101', model: 'YOLOv8 Security Suite' },
    { id: '02', name: 'CAM-02', location: 'Sảnh đón khách (Lobby)', status: 'online', ipAddress: '192.168.1.102', model: 'YOLOv8 Security Suite' },
    { id: '03', name: 'CAM-03', location: 'Kho hàng B (Warehouse B)', status: 'online', ipAddress: '192.168.1.103', model: 'YOLOv8 Security Suite' },
    { id: '04', name: 'CAM-04', location: 'Xưởng đóng gói (Packaging)', status: 'online', ipAddress: '192.168.1.104', model: 'YOLOv8 Security Suite' },
    { id: '05', name: 'CAM-05', location: 'Văn phòng hành chính', status: 'online', ipAddress: '192.168.1.105', model: 'YOLOv8 Security Suite' },
    { id: '06', name: 'CAM-06', location: 'Cổng phụ xe tải', status: 'offline', ipAddress: '192.168.1.106', model: 'Không cấu hình' }
  ]);

  const [overlayActive, setOverlayActive] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCamName, setNewCamName] = useState('');
  const [newCamLoc, setNewCamLoc] = useState('');

  // Canvas drawing ref for a mock live stream inside the card (similar to Cam 03)
  const canvasRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});

  useEffect(() => {
    // Set up canvas animation for CAM-03 inside the cameras list
    const canvas = canvasRefs.current['03'];
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    const worker = { x: 50, y: 70, dx: 1.0, dy: 0.2 };

    const animate = () => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }

      // Move box
      worker.x += worker.dx;
      worker.y += worker.dy;
      if (worker.x < 20 || worker.x > canvas.width - 60) worker.dx *= -1;
      if (worker.y < 20 || worker.y > canvas.height - 70) worker.dy *= -1;

      // Draw box overlay if enabled
      if (overlayActive) {
        // Red bounding box - simulating helmet violation
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.strokeRect(worker.x, worker.y, 40, 60);

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(worker.x, worker.y - 15, 40, 15);

        ctx.fillStyle = '#ffffff';
        ctx.font = '8px Inter';
        ctx.fillText('NO-HELMET', worker.x + 2, worker.y - 4);

        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(worker.x + 20, worker.y + 10, 5, 0, Math.PI * 2); ctx.fill();
      } else {
        // Just draw a plain green wireframe represent worker without AI
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(worker.x, worker.y, 40, 60);
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '9px Courier New';
      ctx.fillText(`CAM-03 LIVE FEED`, 10, 20);

      frameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frameId);
  }, [overlayActive, cameras]);

  const handleAddCamera = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCamName || !newCamLoc) {
      alert('Vui lòng điền đủ thông tin');
      return;
    }
    const newId = (cameras.length + 1).toString().padStart(2, '0');
    const newCam: Camera = {
      id: newId,
      name: newCamName,
      location: newCamLoc,
      status: 'online',
      ipAddress: `192.168.1.${100 + cameras.length + 1}`,
      model: 'YOLOv8 Security Suite'
    };
    setCameras([...cameras, newCam]);
    setNewCamName('');
    setNewCamLoc('');
    setShowAddModal(false);
  };

  return (
    <div>
      <div className={styles.topBar}>
        <button 
          className="btn btn-outline"
          onClick={() => setOverlayActive(!overlayActive)}
        >
          <span className="material-symbols-outlined">
            {overlayActive ? 'visibility' : 'visibility_off'}
          </span>
          {overlayActive ? 'Tắt AI Overlays' : 'Bật AI Overlays'}
        </button>
        
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <span className="material-symbols-outlined">add</span>
          Thêm Camera mới
        </button>
      </div>

      {/* Cameras Grid */}
      <div className={styles.camerasGrid}>
        {cameras.map((cam) => (
          <div key={cam.id} className={`${styles.cameraCard} glass-panel`}>
            <div className={styles.streamContainer}>
              <span className={styles.badgeOverlay}>{cam.name}</span>
              
              {cam.id === '03' && cam.status === 'online' ? (
                <canvas 
                  ref={(el) => { canvasRefs.current[cam.id] = el; }} 
                  width={300} 
                  height={170} 
                  className={styles.canvas}
                />
              ) : cam.status === 'online' ? (
                <div className={styles.streamPlaceholder} style={{ zIndex: 1 }}>
                  <span className="material-symbols-outlined text-4xl" style={{ color: 'rgba(37,99,235,0.3)' }}>videocam</span>
                  <span style={{ fontSize: '12px' }}>Live Feed Active (No dynamic data)</span>
                  {overlayActive && (
                    <div style={{ fontSize: '10px', color: 'var(--color-success)', fontWeight: 'bold' }}>
                      🟢 [AI Safe State Detected]
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.streamPlaceholder}>
                  <span className="material-symbols-outlined text-4xl" style={{ color: 'var(--on-surface-variant)' }}>videocam_off</span>
                  <span>Camera Offline</span>
                </div>
              )}
            </div>

            <div className={styles.cardFooter}>
              <div>
                <div className={styles.camName}>{cam.location}</div>
                <div className={styles.camLocation}>{cam.ipAddress} • {cam.model}</div>
              </div>
              
              <div className={styles.statusIndicator}>
                <span 
                  className={styles.statusCircle}
                  style={{ 
                    backgroundColor: cam.status === 'online' ? 'var(--color-success)' : 'var(--outline)',
                    boxShadow: cam.status === 'online' ? '0 0 6px var(--color-success)' : 'none'
                  }}
                ></span>
                <span style={{ textTransform: 'capitalize', fontSize: '11px', fontWeight: 600 }}>{cam.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Add Camera Dialog Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-panel" style={{ padding: '24px', width: '360px', backgroundColor: 'var(--surface-lowest)' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>Cấu hình Camera mới</h3>
            <form onSubmit={handleAddCamera} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="input-group">
                <label className="input-label" htmlFor="camName">Mã Camera</label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    id="camName" 
                    className="input-field" 
                    placeholder="Ví dụ: CAM-07" 
                    value={newCamName}
                    onChange={(e) => setNewCamName(e.target.value)}
                    required
                    style={{ paddingLeft: '12px' }}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="camLoc">Vị trí Lắp đặt</label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    id="camLoc" 
                    className="input-field" 
                    placeholder="Ví dụ: Nhà để xe máy" 
                    value={newCamLoc}
                    onChange={(e) => setNewCamLoc(e.target.value)}
                    required
                    style={{ paddingLeft: '12px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button type="button" className="btn btn-outline" style={{ height: '36px' }} onClick={() => setShowAddModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary" style={{ height: '36px' }}>
                  Lưu lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
