import { Injectable } from '@angular/core';
import sha256 from 'crypto-js/sha256';
import Hex from 'crypto-js/enc-hex';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import Utf16 from 'crypto-js/enc-utf16';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  public encrypt(str: string, enc?: string): string {
    const hash = sha256(str);
    if (enc) {
      enc = enc.toLowerCase();
    }
    switch (enc) {
      case 'base64':
        return Base64.stringify(hash);
      case 'hex':
        return Hex.stringify(hash);
      case 'utf8':
        return Utf8.stringify(hash);
      case 'utf16':
        return Utf16.stringify(hash);
      default:
        return Hex.stringify(hash);
    }
  }

  public encryptWithSalt(str: string, salt: string, enc?: string): string {
    const hash = sha256(sha256(str) + salt);
    if (enc) {
      enc = enc.toLowerCase();
    }
    switch (enc) {
      case 'base64':
        return Base64.stringify(hash);
      case 'hex':
        return Hex.stringify(hash);
      case 'utf8':
        return Utf8.stringify(hash);
      case 'utf16':
        return Utf16.stringify(hash);
      default:
        return Hex.stringify(hash);
    }
  }
}
