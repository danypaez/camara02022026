"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { Send, Video, Monitor, User, LogOut } from 'lucide-react';
import dynamic from 'next/dynamic';

const supabase = createClient();

export default function ChatContent() {
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [usuario, setUsuario] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Obtener sesión del usuario
    supabase.auth.getUser().then(({ data }) => {
      setUsuario(data.user);
    });

    // 2. Cargar mensajes iniciales
    const fetchMensajes = async () => {
      const { data } = await supabase
        .from('mensajes')
        .select('*')
        .order('creado_at', { ascending: true });
      if (data) setMensajes(data);
    };
    fetchMensajes();

    // 3. Suscribirse a nuevos mensajes en tiempo real
    const canal = supabase
      .channel('chat_general')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensajes' }, 
      (payload) => {
        setMensajes((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(canal); };
  }, []);

  // Auto-scroll al recibir mensajes
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;

    await supabase.from('mensajes').insert([
      { 
        contenido: nuevoMensaje, 
        enviado_por: usuario.id,
        username: usuario.email.split('@')[0] 
      }
    ]);
    setNuevoMensaje("");
  };

  return (
    <div className="chat-container">
      {/* SIDEBAR DE MONITOREO */}
      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <Monitor size={20} />
          <span>SISTEMA DE MONITOREO</span>
        </div>
        <div className="user-list">
          <p className="section-label">USUARIOS ACTIVOS</p>
          <div className="user-item online">
            <div className="status-dot" />
            <span>Operador_Central</span>
          </div>
        </div>
        <button className="btn-logout" onClick={() => supabase.auth.signOut()}>
          <LogOut size={16} /> Salir
        </button>
      </aside>

      {/* ÁREA DE CHAT */}
      <main className="chat-main">
        <header className="chat-header">
          <div className="header-info">
            <h2>Canal General de Operaciones</h2>
            <p>Monitoreo activo • Cifrado punto a punto</p>
          </div>
          <button className="btn-call-action" onClick={() => window.location.href = '/llamada'}>
            <Video size={18} /> INICIAR VIDEOLLAMADA
          </button>
        </header>

        <div className="messages-area">
          {mensajes.map((msg) => (
            <div key={msg.id} className={`message-bubble ${msg.enviado_por === usuario?.id ? 'mine' : 'theirs'}`}>
              <span className="msg-user">{msg.username}</span>
              <p>{msg.contenido}</p>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        <form className="chat-input-area" onSubmit={enviarMensaje}>
          <input 
            type="text" 
            placeholder="Escriba un reporte o mensaje..." 
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
          />
          <button type="submit"><Send size={20} /></button>
        </form>
      </main>
    </div>
  );
}