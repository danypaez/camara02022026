 "use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Video, Monitor, LogOut } from "lucide-react";

type Mensaje = {
  id: number;
  contenido: string;
  username: string;
  enviado_por: "me" | "other";
};

export default function ChatContent() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Usuario mockeado (podés reemplazar luego)
  const usuario = {
    id: "me",
    username: "Operador_Central",
  };

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const enviarMensaje = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;

    const nuevo: Mensaje = {
      id: Date.now(),
      contenido: nuevoMensaje,
      username: usuario.username,
      enviado_por: "me",
    };

    setMensajes((prev) => [...prev, nuevo]);
    setNuevoMensaje("");
  };

  return (
    <div className="chat-container">
      {/* SIDEBAR */}
      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <Monitor size={20} />
          <span>SISTEMA DE MONITOREO</span>
        </div>

        <div className="user-list">
          <p className="section-label">USUARIOS ACTIVOS</p>
          <div className="user-item online">
            <div className="status-dot" />
            <span>{usuario.username}</span>
          </div>
        </div>

        <button
          className="btn-logout"
          onClick={() => alert("Sesión cerrada")}
        >
          <LogOut size={16} /> Salir
        </button>
      </aside>

      {/* CHAT */}
      <main className="chat-main">
        <header className="chat-header">
          <div className="header-info">
            <h2>Canal General de Operaciones</h2>
            <p>Monitoreo activo</p>
          </div>

          <button
            className="btn-call-action"
            onClick={() => (window.location.href = "/llamada")}
          >
            <Video size={18} /> INICIAR VIDEOLLAMADA
          </button>
        </header>

        <div className="messages-area">
          {mensajes.map((msg) => (
            <div
              key={msg.id}
              className={`message-bubble ${
                msg.enviado_por === "me" ? "mine" : "theirs"
              }`}
            >
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
          <button type="submit">
            <Send size={20} />
          </button>
        </form>
      </main>
    </div>
  );
}
