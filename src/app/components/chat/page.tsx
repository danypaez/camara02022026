"use client";

import dynamic from 'next/dynamic';

// Cargamos el contenido del chat solo en el cliente
const ChatContent = dynamic(
  () => import('./ChatContent'),
  { ssr: false }
);

export default function ChatPage() {
  return <ChatContent />;
}