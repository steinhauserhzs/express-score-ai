interface RetryOptions {
  maxRetries?: number;
  delay?: number;
  backoff?: boolean;
}

export async function retryFetch<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = true
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        const waitTime = backoff ? delay * Math.pow(2, attempt) : delay;
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError!;
}

export async function retrySupabaseFunction<T>(
  functionName: string,
  body: any,
  options?: RetryOptions
): Promise<T> {
  const { supabase } = await import('@/integrations/supabase/client');
  
  return retryFetch(
    async () => {
      const { data, error } = await supabase.functions.invoke(functionName, { body });
      if (error) throw error;
      return data as T;
    },
    options
  );
}
