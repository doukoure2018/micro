import { Key } from '@/enum/cache.key';
import { Inject, Injectable, InjectionToken } from '@angular/core';

const CLIENT_STORAGE = new InjectionToken<Storage>('CLIENT_STORAGE', { factory: () => localStorage });
@Injectable()
export class StorageService {
    constructor(@Inject(CLIENT_STORAGE) private storage: Storage) {}

    // we are going to get the storage key
    get = (key: string): string => this.storage.getItem(key) || '';

    set = (key: string, value: any) => this.storage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));

    remove = (key: string) => this.storage.removeItem(key);

    getRedirectUrl = () => this.get(Key.REDIRECT_URL) || '';

    setRedirectUrl = (redirect_url: string) => this.set(Key.REDIRECT_URL, redirect_url);

    removeRedirectUrl = () => this.remove(Key.REDIRECT_URL);
}
