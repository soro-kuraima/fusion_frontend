"use client";

import { Noir } from "@noir-lang/noir_js";
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { ethers } from "ethers";
import poseidon_hash from "@/utils/circuits/poseidon_hash";
import password_hash from "@/utils/circuits/password_hash";
import signatureProve from "@/utils/circuits/signature_prove";
import passwordProve from "@/utils/circuits/password_prove";

export default function useCircuit() {
  const hashPassword = async (password) => {
    const backend = new BarretenbergBackend(password_hash, {
      threads: navigator.hardwareConcurrency,
    });

    const noir = new Noir(password_hash, backend);

    const input = {
      password: ethers.utils.hexlify(
        ethers.utils.ripemd160(ethers.utils.toUtf8Bytes(password))
      ),
    };

    const output = await noir.execute(input);

    return output.returnValue;
  };

  const hashKey = async (key) => {
    const backend = new BarretenbergBackend(poseidon_hash, {
      threads: navigator.hardwareConcurrency,
    });

    const noir = new Noir(poseidon_hash, backend);

    const inputs = {
      input: Array.from(ethers.utils.arrayify(key)),
    };

    const output = await noir.execute(inputs);

    return output.returnValue;
  };

  const signature_prove = async (
    pubkeyx,
    pubkeyy,
    signature,
    message,
    address
  ) => {
    try {
      const backend = new BarretenbergBackend(signatureProve, {
        threads: navigator.hardwareConcurrency,
      });

      const recoveryHash = await hashKey(pubkeyx);

      signature.pop();

      const bytes32Address = ethers.utils.hexZeroPad(address, 32);

      const inputs = {
        pub_key_x: Array.from(ethers.utils.arrayify(pubkeyx)),
        pub_key_y: Array.from(ethers.utils.arrayify(pubkeyy)),
        signature: signature,
        hashed_message: message,
        pub_key_x_hash: recoveryHash,
        signing_address: bytes32Address,
        proving_address: bytes32Address,
      };

      const noir = new Noir(signatureProve, backend);

      const output = await noir.generateFinalProof(inputs);

      return ethers.utils.hexlify(output.proof);
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const password_prove = async (password, nonce, address) => {
    const backend = new BarretenbergBackend(passwordProve, {
      threads: navigator.hardwareConcurrency,
    });

    const noir = new Noir(passwordProve, backend);

    const passwordHex = await hashPassword(password);

    const message = ethers.utils.hashMessage(nonce.toString());

    const bytes32Address = ethers.utils.hexZeroPad(address, 32);

    const inputs = {
      password: ethers.utils.hexlify(
        ethers.utils.ripemd160(ethers.utils.toUtf8Bytes(password))
      ),
      flagged_message: Array.from(ethers.utils.arrayify(message)),
      hashed_message: Array.from(ethers.utils.arrayify(message)),
      password_hash: passwordHex,
      signing_address: bytes32Address,
      proving_address: bytes32Address,
    };

    const output = await noir.generateFinalProof(inputs);

    return ethers.utils.hexlify(output.proof);
  };

  return { hashPassword, hashKey, signature_prove, password_prove };
}
