import React, { useState, useEffect } from 'react';
import type { AppSettings, Service } from '../types';
import { generateUniqueId } from '../utils/helpers';
import { PlusCircleIcon, TrashIcon, LogoutIcon, NotificationIcon } from './Icons';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onThemeChange: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings, onLogout, theme, onThemeChange }) => {
  const [newTag, setNewTag] = useState('');
  const [editingPrice, setEditingPrice] = useState<{id: string, value: string} | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(Notification.permission);


  useEffect(() => {
    // This is to update the permission status if the user changes it in the browser settings
    const interval = setInterval(() => {
      if (Notification.permission !== notificationPermission) {
        setNotificationPermission(Notification.permission);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [notificationPermission]);

  const handleServiceChange = (id: string, field: keyof Omit<Service, 'id'>, value: string) => {
    const newServices = settings.services.map(service => {
      if (service.id === id) {
        return { ...service, [field]: field === 'price' ? parseFloat(value) || 0 : value };
      }
      return service;
    });
    onUpdateSettings({ ...settings, services: newServices });
  };

  const handleNotificationToggle = async () => {
    const newEnabledState = !settings.notificationsEnabled;
    if (newEnabledState && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        onUpdateSettings({ ...settings, notificationsEnabled: true });
      }
    } else {
      onUpdateSettings({ ...settings, notificationsEnabled: newEnabledState });
    }
  };
  
  const handleNotificationMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const minutes = parseInt(e.target.value, 10);
      onUpdateSettings({ ...settings, notificationMinutes: isNaN(minutes) ? 0 : minutes });
  };

  const addService = () => {
    const newService: Service = {
      id: generateUniqueId(),
      name: 'Novo Atendimento',
      price: 20.00,
    };
    onUpdateSettings({ ...settings, services: [...settings.services, newService] });
  };

  const removeService = (id: string) => {
    if (settings.services.length <= 1) {
      alert("É necessário ter pelo menos um tipo de atendimento.");
      return;
    }
    const newServices = settings.services.filter(service => service.id !== id);
    onUpdateSettings({ ...settings, services: newServices });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !settings.studentTags.includes(newTag.trim())) {
      onUpdateSettings({ ...settings, studentTags: [...settings.studentTags, newTag.trim()] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateSettings({ ...settings, studentTags: settings.studentTags.filter(tag => tag !== tagToRemove) });
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Tem certeza que deseja apagar sua conta? Esta ação é irreversível e todos os seus dados serão perdidos.')) {
      localStorage.clear();
      onLogout();
    }
  };

  const getPermissionStatusText = () => {
    switch (notificationPermission) {
        case 'granted': return { text: 'Concedida', color: 'text-green-600 dark:text-green-400' };
        case 'denied': return { text: 'Negada', color: 'text-red-600 dark:text-red-400' };
        default: return { text: 'Não Solicitada', color: 'text-yellow-600 dark:text-yellow-400' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-brand-darkgray dark:text-gray-200">Configurações</h2>
            <p className="text-brand-gray dark:text-gray-400">Ajuste as configurações do sistema.</p>
        </div>
      
      <div className="bg-brand-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-8">
        
        {/* Account Section */}
        <div>
            <h3 className="text-xl font-semibold text-brand-darkgray dark:text-gray-200">Conta</h3>
             <p className="text-sm text-brand-gray dark:text-gray-400 mb-4">
                Gerencie sua sessão.
            </p>
            <button
              onClick={onLogout}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 text-sm text-brand-darkgray bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 font-medium py-2 px-4 rounded-lg transition-colors"
              title="Sair"
            >
              <LogoutIcon className="w-5 h-5" />
              <span>Sair da Conta</span>
            </button>
        </div>

        {/* Appearance Section */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-brand-darkgray dark:text-gray-200">Aparência</h3>
            <p className="text-sm text-brand-gray dark:text-gray-400 mb-4">
                Escolha entre o tema claro ou escuro.
            </p>
            <div className="flex items-center space-x-4 p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <span className="font-medium text-gray-700 dark:text-gray-300">Tema</span>
                <button 
                    onClick={onThemeChange}
                    className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-gray-200 dark:bg-gray-600"
                >
                    <span className={`${
                        theme === 'dark' ? 'translate-x-6 bg-primary' : 'translate-x-1 bg-white'
                    } inline-block w-4 h-4 transform rounded-full transition-transform`} />
                </button>
                <span className="font-semibold text-brand-darkgray dark:text-gray-200 capitalize">{theme === 'light' ? 'Claro' : 'Escuro'}</span>
            </div>
        </div>
        
        {/* Notifications Section */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-brand-darkgray dark:text-gray-200">Notificações</h3>
            <p className="text-sm text-brand-gray dark:text-gray-400 mb-4">
                Receba lembretes antes dos seus atendimentos.
            </p>
            <div className="space-y-4 p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><NotificationIcon /> Ativar Lembretes</span>
                    <button 
                        onClick={handleNotificationToggle}
                        className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-gray-200 dark:bg-gray-600"
                        aria-checked={settings.notificationsEnabled}
                    >
                        <span className={`${
                            settings.notificationsEnabled ? 'translate-x-6 bg-primary' : 'translate-x-1 bg-white'
                        } inline-block w-4 h-4 transform rounded-full transition-transform`} />
                    </button>
                </div>
                {settings.notificationsEnabled && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                        <label htmlFor="notification-minutes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lembrar com antecedência de:</label>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                              id="notification-minutes"
                              type="number"
                              value={settings.notificationMinutes}
                              onChange={handleNotificationMinutesChange}
                              className="w-24 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                              min="1"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">minutos.</span>
                        </div>
                    </div>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400 pt-2">
                    Status da permissão do navegador: <span className={`font-bold ${getPermissionStatusText().color}`}>{getPermissionStatusText().text}</span>
                    {notificationPermission === 'denied' && " - Habilite nas configurações do seu navegador."}
                </div>
            </div>
        </div>

        {/* Services Section */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-brand-darkgray dark:text-gray-200">
            Tipos de Atendimento
          </h3>
          <p className="text-sm text-brand-gray dark:text-gray-400 mb-4">
            Gerencie os serviços oferecidos e seus respectivos valores.
          </p>
          <div className="space-y-4">
            {settings.services.map(service => {
              const isEditingPrice = editingPrice && editingPrice.id === service.id;
              return (
              <div key={service.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50 dark:border-gray-700">
                <div className="md:col-span-3">
                  <label htmlFor={`service-name-${service.id}`} className="text-xs font-medium text-gray-500 dark:text-gray-400">Nome do Atendimento</label>
                  <input
                    id={`service-name-${service.id}`}
                    type="text"
                    value={service.name}
                    onChange={e => handleServiceChange(service.id, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    placeholder="Ex: Pilates"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor={`service-price-${service.id}`} className="text-xs font-medium text-gray-500 dark:text-gray-400">Valor (R$)</label>
                  <input
                    id={`service-price-${service.id}`}
                    type="number"
                    value={isEditingPrice ? editingPrice.value : service.price}
                    onFocus={() => setEditingPrice({ id: service.id, value: service.price === 0 ? '' : String(service.price) })}
                    onChange={e => setEditingPrice({ ...editingPrice!, value: e.target.value })}
                    onBlur={() => {
                      if (isEditingPrice) {
                        const parsedValue = parseFloat(editingPrice.value);
                        const finalValue = isNaN(parsedValue) ? 0 : parsedValue;
                        handleServiceChange(service.id, 'price', String(finalValue));
                        setEditingPrice(null);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === 'Tab') {
                        e.currentTarget.blur();
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="md:col-span-1 flex items-end justify-center h-full">
                  <button
                    onClick={() => removeService(service.id)}
                    disabled={settings.services.length <= 1}
                    className="w-full flex items-center justify-center space-x-2 text-sm text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50 font-medium py-2 px-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-transparent"
                    title="Remover Atendimento"
                  >
                    <TrashIcon />
                    <span className="hidden md:inline">Remover</span>
                  </button>
                </div>
              </div>
            )})}
          </div>
          <button 
            onClick={addService} 
            className="mt-6 w-full md:w-auto flex items-center justify-center space-x-2 text-sm text-primary-dark bg-primary-light hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900/50 dark:hover:bg-blue-900 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <PlusCircleIcon />
            <span>Adicionar Atendimento</span>
          </button>
        </div>

        {/* Tags Section */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-brand-darkgray dark:text-gray-200">Legendas de Alunos</h3>
          <p className="text-sm text-brand-gray dark:text-gray-400 mb-4">
            Crie e gerencie legendas para classificar seus alunos (ex: Estúdio, Wellhub, Gympass).
          </p>
          <div className="space-y-3 mb-4">
            {settings.studentTags.map(tag => (
              <div key={tag} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-700/50">
                <span className="font-medium text-gray-700 dark:text-gray-300">{tag}</span>
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-100 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/50 rounded-full transition-colors"
                  title={`Remover legenda "${tag}"`}
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              placeholder="Nova legenda"
              className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            />
            <button
              onClick={handleAddTag}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 text-sm text-primary-dark bg-primary-light hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900/50 dark:hover:bg-blue-900 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <PlusCircleIcon />
              <span>Adicionar</span>
            </button>
          </div>
        </div>
      </div>
       {/* Danger Zone */}
       <div className="mt-12 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">Zona de Perigo</h3>
          <p className="text-sm text-red-700 dark:text-red-400 mt-1 mb-4">
            Esta ação não pode ser desfeita. Isso excluirá permanentemente todos os seus dados de agendamento, despesas e configurações.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 dark:hover:bg-red-500 transition-colors"
          >
            Apagar Conta
          </button>
        </div>
    </div>
  );
};

export default Settings;