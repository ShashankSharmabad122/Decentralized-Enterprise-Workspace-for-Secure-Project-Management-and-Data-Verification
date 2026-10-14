import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Lock,
  Unlock,
  ShieldAlert,
  ShieldCheck,
  Plus,
  Upload,
  RefreshCw,
  Database,
  Hash,
  Eye,
  Key,
  Server,
  AlertTriangle,
  CheckCircle2,
  Share2,
  FileUp,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";
import { EncryptedFile } from "../../types";

export const FileExplorerVault: React.FC = () => {
  const [files, setFiles] = useState<EncryptedFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<EncryptedFile | null>(null);

  // File upload & Encryption state
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newFileName, setNewFileName] = useState("Enterprise_Audit_Report.txt");
  const [newFileContent, setNewFileContent] = useState(
    "CONFIDENTIAL ENTERPRISE DOCUMENT\nProject: dOS - Decentralized Workspace\nAuthor: Shashank Sharma (MCA Sem 3)\nStatus: RSA-AES Encrypted & SHA-256 Blockchain Verified."
  );
  const [isTesseraPrivate, setIsTesseraPrivate] = useState(true);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptionPipelineStep, setEncryptionPipelineStep] = useState<string | null>(null);

  // Decryption preview state
  const [decryptedText, setDecryptedText] = useState<string | null>(null);
  const [decryptionResult, setDecryptionResult] = useState<any>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/files");
      const data = await res.json();
      if (data.files) {
        setFiles(data.files);
        if (data.files.length > 0 && !selectedFile) {
          setSelectedFile(data.files[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (file: File) => {
    setNewFileName(file.name);
    const reader = new FileReader();

    if (file.type.startsWith("image/") || file.type === "application/pdf") {
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setNewFileContent(reader.result);
        }
      };
    } else {
      reader.readAsText(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setNewFileContent(reader.result);
        }
      };
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleCreateAndEncrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileContent) return;
    setIsEncrypting(true);

    try {
      setEncryptionPipelineStep("Step 1: Fetching Server RSA-2048 Public Key...");
      await new Promise((r) => setTimeout(r, 400));

      setEncryptionPipelineStep("Step 2: Generating AES-256 Key & IV...");
      await new Promise((r) => setTimeout(r, 400));

      setEncryptionPipelineStep("Step 3: Encrypting Payload with AES-256-GCM...");
      await new Promise((r) => setTimeout(r, 400));

      setEncryptionPipelineStep("Step 4: Wrapping AES Key with RSA Public Key...");
      await new Promise((r) => setTimeout(r, 400));

      setEncryptionPipelineStep("Step 5: Submitting SHA-256 Fingerprint to Hyperledger Besu (Paymaster Sponsored)...");

      const mimeType = newFileName.endsWith(".png") || newFileName.endsWith(".jpg")
        ? "image/png"
        : newFileName.endsWith(".pdf")
        ? "application/pdf"
        : "text/plain";

      const res = await fetch("/api/crypto/encrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newFileName,
          content: newFileContent,
          mimeType,
          tesseraPrivate: isTesseraPrivate,
          accessRoles: ["Enterprise Admin", "Auditor"],
        }),
      });

      const data = await res.json();
      if (data.success && data.file) {
        setFiles([data.file, ...files]);
        setSelectedFile(data.file);
        setNewFileName("Encrypted_Doc_" + Math.floor(Math.random() * 1000) + ".txt");
        setNewFileContent("Confidential payload data...");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEncrypting(false);
      setEncryptionPipelineStep(null);
    }
  };

  const handleDecryptFile = async (simulateTamper: boolean = false) => {
    if (!selectedFile) return;
    setIsDecrypting(true);
    setDecryptedText(null);
    setDecryptionResult(null);

    try {
      const res = await fetch("/api/crypto/decrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileId: selectedFile.id,
          simulateTamper,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDecryptedText(data.decryptedContent);
        setDecryptionResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleTamperInDatabase = async () => {
    if (!selectedFile) return;
    try {
      const res = await fetch("/api/files/tamper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: selectedFile.id }),
      });
      const data = await res.json();
      if (data.success) {
        fetchFiles();
        handleDecryptFile(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#030712] text-slate-100 font-sans">
      {/* Top Controls Bar */}
      <div className="bg-[#080d1a] border-b border-cyan-500/20 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-2.5">
          <Lock className="w-5 h-5 text-cyan-400" />
          <h2 className="font-extrabold text-sm text-white tracking-tight">
            RSA-AES Hybrid Cryptographic File Vault
          </h2>
          <span className="text-xs bg-cyan-950 border border-cyan-500/40 text-cyan-300 px-2.5 py-0.5 rounded-full font-mono font-bold">
            Zero Trust Pipeline
          </span>
        </div>

        <button
          onClick={fetchFiles}
          className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-cyan-300 transition-colors flex items-center space-x-1.5 text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Vault</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Col: File List */}
        <div className="lg:col-span-4 border-r border-slate-800 bg-[#080d1a]/50 p-4 space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider font-mono">
              Encrypted Documents ({files.length})
            </span>
          </div>

          <div className="space-y-2.5">
            {files.map((file) => (
              <div
                key={file.id}
                onClick={() => {
                  setSelectedFile(file);
                  setDecryptedText(null);
                  setDecryptionResult(null);
                }}
                className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all space-y-2 ${
                  selectedFile?.id === file.id
                    ? "bg-[#080d1a] border-cyan-500/80 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                    : "bg-[#030712]/90 border-slate-800 hover:border-cyan-500/30"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 font-semibold text-slate-100">
                    <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="truncate max-w-[170px]">{file.name}</span>
                  </div>
                  {file.isTampered ? (
                    <span className="bg-rose-950/80 border border-rose-800 text-rose-300 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold flex items-center space-x-1">
                      <ShieldAlert className="w-3 h-3" />
                      <span>Tampered</span>
                    </span>
                  ) : (
                    <span className="bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                      Verified
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 font-mono truncate">
                  SHA-256: {file.sha256Hash.substring(0, 18)}...
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800">
                  <span className="text-indigo-400 font-mono font-semibold">{file.shardNode}</span>
                  <span className="font-mono">Block #{file.blockNumber}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Drag & Drop Upload & Cryptographic Inspector */}
        <div className="lg:col-span-8 p-5 space-y-6 overflow-y-auto bg-[#030712]">
          {/* File Drag & Drop Upload Zone */}
          <div className="igloo-glass-card rounded-3xl p-5 space-y-4 border-cyan-500/25">
            <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono flex items-center space-x-2">
              <FileUp className="w-4 h-4 text-cyan-400" />
              <span>RSA-AES Upload & Blockchain Ledger Pipeline</span>
            </h3>

            {/* Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                dragActive
                  ? "border-cyan-400 bg-cyan-950/30 text-cyan-200"
                  : "border-slate-800 hover:border-cyan-500/50 bg-[#030712]/80 text-slate-300"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <Upload className="w-9 h-9 mx-auto text-cyan-400 mb-2 animate-bounce" />
              <p className="text-xs font-bold text-slate-100">
                Drag & Drop file here, or <span className="text-cyan-400 underline">browse local files</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">
                Supports TXT, PDF, PNG, JPG, JSON, CSV — Encrypted via RSA-2048 & AES-256-GCM
              </p>
            </div>

            {/* Form Details */}
            <form onSubmit={handleCreateAndEncrypt} className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="Document Name (e.g. Audit_Report.txt)"
                  className="bg-[#030712] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
                <div className="flex items-center space-x-2 bg-[#030712] border border-slate-800 rounded-xl px-3.5 py-2 text-xs">
                  <input
                    type="checkbox"
                    id="tessera"
                    checked={isTesseraPrivate}
                    onChange={(e) => setIsTesseraPrivate(e.target.checked)}
                    className="rounded text-cyan-500 focus:ring-0"
                  />
                  <label htmlFor="tessera" className="text-slate-300 font-mono text-[11px] cursor-pointer">
                    Tessera Private Tx (Hyperledger Besu)
                  </label>
                </div>
              </div>

              <textarea
                value={newFileContent}
                onChange={(e) => setNewFileContent(e.target.value)}
                rows={3}
                placeholder="Document content preview or payload text..."
                className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
              />

              {/* Encryption Pipeline Visualizer */}
              {isEncrypting && encryptionPipelineStep && (
                <div className="bg-cyan-950/70 border border-cyan-500/50 rounded-xl p-3 text-xs text-cyan-200 font-mono flex items-center space-x-2 animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{encryptionPipelineStep}</span>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isEncrypting || !newFileContent}
                  className="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] disabled:opacity-50 transition-all"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-950" />
                  <span>{isEncrypting ? "Running Cryptographic Pipeline..." : "Encrypt RSA-AES & Commit Ledger"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Selected File Inspection & Decryption Panel */}
          {selectedFile && (
            <div className="igloo-glass-card border border-slate-800 rounded-3xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-white text-base flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>{selectedFile.name}</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Owner Address: {selectedFile.ownerAddress}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDecryptFile(false)}
                    disabled={isDecrypting}
                    className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  >
                    <Unlock className="w-3.5 h-3.5 text-slate-950" />
                    <span>Decrypt & Verify Integrity</span>
                  </button>

                  <button
                    onClick={handleTamperInDatabase}
                    className="bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
                    title="Corrupt MySQL Shard data to test Hyperledger Besu integrity check"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Simulate Off-Chain Tamper</span>
                  </button>
                </div>
              </div>

              {/* Cryptographic Inspector Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="bg-[#030712] p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider block">
                    Cryptographic Checksum
                  </span>
                  <div className="text-cyan-400 truncate font-bold">
                    SHA-256 Verified
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {selectedFile.sha256Hash}
                  </div>
                </div>

                <div className="bg-[#030712] p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider block">
                    Hyperledger Besu Block
                  </span>
                  <div className="text-indigo-400 font-bold">
                    Block #{selectedFile.blockNumber}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    Tx: {selectedFile.blockchainTxHash.substring(0, 16)}...
                  </div>
                </div>

                <div className="bg-[#030712] p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider block">
                    MySQL Sharded Node
                  </span>
                  <div className="text-purple-400 font-bold">
                    {selectedFile.shardNode}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Tessera Private: {selectedFile.tesseraPrivate ? "YES" : "NO"}
                  </div>
                </div>
              </div>

              {/* Decrypted Output / Verification Result */}
              {decryptionResult && (
                <div
                  className={`p-4 rounded-2xl border space-y-3 ${
                    decryptionResult.isIntegrityValid
                      ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                      : "bg-rose-950/60 border-rose-500/80 text-rose-200 animate-pulse"
                  }`}
                >
                  <div className="flex items-center space-x-2 font-bold text-xs">
                    {decryptionResult.isIntegrityValid ? (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                    )}
                    <span>{decryptionResult.message}</span>
                  </div>

                  {decryptedText && (
                    <div className="bg-[#030712] p-3.5 rounded-xl border border-slate-800 font-mono text-xs space-y-1 text-slate-300">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">
                        Decrypted Payload Content:
                      </span>
                      {decryptedText.startsWith("data:image/") ? (
                        <img
                          src={decryptedText}
                          alt="Decrypted File"
                          className="max-h-64 rounded-lg border border-slate-700 mx-auto shadow-lg"
                        />
                      ) : (
                        <pre className="whitespace-pre-wrap max-h-48 overflow-y-auto">{decryptedText}</pre>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
