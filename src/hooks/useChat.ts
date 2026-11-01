import { useState, useEffect } from 'react';
import { chatApi, BackendMessage, BackendConversation } from '../api';
import { subscribeToConversation, unsubscribeFromConversation } from '../echo';

export function useChat(initialConversationId: number = 1) {
  const [conversations, setConversations] = useState<BackendConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number>(initialConversationId);
  const [messages, setMessages] = useState<BackendMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // 1. Charger les conversations au démarrage
  useEffect(() => {
    chatApi.getConversations().then((res) => {
      setConversations(res.data);
      if (res.data.length > 0) {
        setActiveConversationId(res.data[0].id);
      }
      setLoading(false);
    }).catch((err) => {
      console.error("Erreur chargement conversations", err);
      setLoading(false);
    });
  }, []);

  // 2. Charger les messages quand on change de conversation
  useEffect(() => {
    if (!activeConversationId) return;
    
    setLoading(true);
    chatApi.getMessages(activeConversationId).then((res) => {
      setMessages(res.data);
      setLoading(false);
    }).catch((err) => {
      console.error("Erreur chargement messages", err);
      setLoading(false);
    });
  }, [activeConversationId]);

  // 3. Écouter le WebSocket Reverb en temps réel
  useEffect(() => {
    if (!activeConversationId) return;

    const channel = subscribeToConversation(activeConversationId, (newMessage: any) => {
      setMessages((prev) => {
        // Éviter les doublons si on a déjà ajouté le message via l'API
        if (prev.some(m => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });
    });

    return () => {
      unsubscribeFromConversation(activeConversationId);
    };
  }, [activeConversationId]);

  // 4. Envoyer un message
  const sendMessage = async (content: string) => {
    if (!activeConversationId || !content.trim()) return;
    setSending(true);
    try {
      const newMessage = await chatApi.sendMessage(activeConversationId, content);
      setMessages((prev) => {
         if (prev.some(m => m.id === newMessage.id)) return prev;
         return [...prev, newMessage];
      });
    } catch (err) {
      console.error("Erreur envoi message", err);
    } finally {
      setSending(false);
    }
  };

  return {
    conversations,
    activeConversationId,
    setActiveConversationId,
    messages,
    loading,
    sending,
    sendMessage
  };
}