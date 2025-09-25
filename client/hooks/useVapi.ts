import { useState, useEffect } from 'react';

interface VapiConfig {
  apiKey: string | null;
  assistantId: string | null;
  isConfigured: boolean;
}

export const useVapiConfig = (): VapiConfig => {
  const [config, setConfig] = useState<VapiConfig>({
    apiKey: null,
    assistantId: null,
    isConfigured: false
  });

  useEffect(() => {
    const apiKey = import.meta.env.VITE_VAPI_PUBLIC_API_KEY;
    const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;

    setConfig({
      apiKey: apiKey || null,
      assistantId: assistantId || null,
      isConfigured: Boolean(apiKey && assistantId)
    });
  }, []);

  return config;
};

export default useVapiConfig;