import { Injectable } from '@nestjs/common';
import { MlKem1024 } from 'mlkem';

@Injectable()
export class TestService {
  async kyberFlow() {
    const kem = new MlKem1024();

    const [publicKey, secretKey] = await kem.generateKeyPair();

    const [ciphertext, sharedSecret] = await kem.encap(publicKey);

    const decryptedSharedSecret = await kem.decap(ciphertext, secretKey);

    return {
      publicKey: Buffer.from(publicKey).toString('base64'),
      secretKey: Buffer.from(secretKey).toString('base64'),
      ciphertext: Buffer.from(ciphertext).toString('base64'),
      originalSharedSecret: Buffer.from(sharedSecret).toString('base64'),
      decryptedSharedSecret: Buffer.from(decryptedSharedSecret).toString('base64'),
      match: Buffer.compare(sharedSecret, decryptedSharedSecret) === 0,
    };
  }
}
