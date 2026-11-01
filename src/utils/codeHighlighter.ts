import Prism from 'prismjs';

// Chargement des langages requis par le projet et le Challenge CADEV 2026
import 'prismjs/components/prism-markup'; // HTML / XML / SVG
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-dart';
import 'prismjs/components/prism-yaml';

// Config PrismJS pour la coloration syntaxique façon VS Code (thème Dark+).

export interface SupportedLanguage {
  id: string;
  name: string;
  prismGrammar: string;
  defaultFilename: string;
  extension: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { id: 'typescript', name: 'TypeScript', prismGrammar: 'typescript', defaultFilename: 'main.ts', extension: 'ts' },
  { id: 'javascript', name: 'JavaScript', prismGrammar: 'javascript', defaultFilename: 'app.js', extension: 'js' },
  { id: 'html', name: 'HTML5', prismGrammar: 'markup', defaultFilename: 'index.html', extension: 'html' },
  { id: 'css', name: 'CSS3', prismGrammar: 'css', defaultFilename: 'styles.css', extension: 'css' },
  { id: 'java', name: 'Java', prismGrammar: 'java', defaultFilename: 'Main.java', extension: 'java' },
  { id: 'go', name: 'Go (Golang)', prismGrammar: 'go', defaultFilename: 'server.go', extension: 'go' },
  { id: 'python', name: 'Python', prismGrammar: 'python', defaultFilename: 'script.py', extension: 'py' },
  { id: 'php', name: 'PHP', prismGrammar: 'php', defaultFilename: 'index.php', extension: 'php' },
  { id: 'rust', name: 'Rust', prismGrammar: 'rust', defaultFilename: 'main.rs', extension: 'rs' },
  { id: 'sql', name: 'SQL / PostgreSQL', prismGrammar: 'sql', defaultFilename: 'query.sql', extension: 'sql' },
  { id: 'csharp', name: 'C# (.NET)', prismGrammar: 'csharp', defaultFilename: 'Program.cs', extension: 'cs' },
  { id: 'kotlin', name: 'Kotlin (Android)', prismGrammar: 'kotlin', defaultFilename: 'MainActivity.kt', extension: 'kt' },
  { id: 'swift', name: 'Swift (iOS)', prismGrammar: 'swift', defaultFilename: 'App.swift', extension: 'swift' },
  { id: 'dart', name: 'Dart / Flutter', prismGrammar: 'dart', defaultFilename: 'main.dart', extension: 'dart' },
  { id: 'cpp', name: 'C++', prismGrammar: 'cpp', defaultFilename: 'program.cpp', extension: 'cpp' },
  { id: 'json', name: 'JSON', prismGrammar: 'json', defaultFilename: 'config.json', extension: 'json' },
  { id: 'yaml', name: 'YAML', prismGrammar: 'yaml', defaultFilename: 'docker-compose.yml', extension: 'yml' },
  { id: 'bash', name: 'Bash / Shell', prismGrammar: 'bash', defaultFilename: 'deploy.sh', extension: 'sh' },
];

/**
 * Détection heuristique automatique du langage à partir du code saisi
 */
export function detectLanguageFromCode(code: string): string {
  if (!code || typeof code !== 'string') return 'typescript';
  const trimmed = code.trim();

  // HTML / XML
  if (
    trimmed.startsWith('<!DOCTYPE') ||
    /<(html|head|body|div|span|button|section|main|nav|form|table|template)[>\s]/i.test(trimmed) ||
    /<\/[a-z]+>/i.test(trimmed)
  ) {
    return 'html';
  }

  // PHP
  if (trimmed.includes('<?php') || /\$\w+\s*=/.test(trimmed)) {
    return 'php';
  }

  // Go (Golang)
  if (
    /package\s+\w+/.test(trimmed) ||
    /func\s+\w+\s*\(/.test(trimmed) ||
    /import\s*\(\s*"fmt"/.test(trimmed) ||
    trimmed.includes(':=')
  ) {
    return 'go';
  }

  // Java
  if (
    /public\s+class\s+\w+/.test(trimmed) ||
    /System\.out\.println/.test(trimmed) ||
    /public\s+static\s+void\s+main/.test(trimmed)
  ) {
    return 'java';
  }

  // Python
  if (
    /def\s+\w+\s*\(.*?\):/.test(trimmed) ||
    /import\s+(numpy|pandas|os|sys|fastapi)/.test(trimmed) ||
    trimmed.includes('if __name__ == "__main__":') ||
    /elif\s+.+:/.test(trimmed)
  ) {
    return 'python';
  }

  // Rust
  if (
    /fn\s+main\s*\(\s*\)/.test(trimmed) ||
    /let\s+mut\s+/.test(trimmed) ||
    /pub\s+struct\s+/.test(trimmed) ||
    /impl\s+\w+/.test(trimmed)
  ) {
    return 'rust';
  }

  // SQL
  if (
    /^(SELECT|INSERT\s+INTO|UPDATE|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE)\b/i.test(trimmed) ||
    /\b(FROM\s+\w+|WHERE\s+\w+|JOIN\s+\w+)\b/i.test(trimmed)
  ) {
    return 'sql';
  }

  // CSS
  if (
    /(@keyframes|@media|@import)\b/.test(trimmed) ||
    (/\{[\s\S]*?\}/.test(trimmed) && /(color:|margin:|padding:|display:|border-radius:|background:)/.test(trimmed))
  ) {
    return 'css';
  }

  // JSON
  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      // Pas du JSON strict
    }
  }

  // Dart / Flutter
  if (/Widget\s+build\(BuildContext/.test(trimmed) || /void\s+main\(\)\s*\{/.test(trimmed)) {
    return 'dart';
  }

  // Kotlin
  if (/fun\s+\w+\s*\(/.test(trimmed) || /val\s+\w+:\s*[A-Z]/.test(trimmed)) {
    return 'kotlin';
  }

  // Swift
  if (/import\s+SwiftUI/.test(trimmed) || /var\s+body:\s+some\s+View/.test(trimmed)) {
    return 'swift';
  }

  // C#
  if (/using\s+System;/.test(trimmed) || /namespace\s+\w+/.test(trimmed)) {
    return 'csharp';
  }

  // Bash
  if (trimmed.startsWith('#!/bin/') || /^(npm\s+|pnpm\s+|yarn\s+|docker\s+|git\s+|curl\s+)/m.test(trimmed)) {
    return 'bash';
  }

  // TypeScript / JavaScript par défaut
  if (
    trimmed.includes('interface ') ||
    trimmed.includes(': string') ||
    trimmed.includes(': number') ||
    trimmed.includes(': boolean') ||
    trimmed.includes('as const') ||
    trimmed.includes('<T>')
  ) {
    return 'typescript';
  }

  return 'typescript';
}

/**
 * Détecte si un texte ressemble à du code informatique
 */
export function isCodeContent(text: string): boolean {
  if (!text || text.trim().length < 8) return false;
  const trimmed = text.trim();

  // Bloc avec backticks ```
  if (trimmed.includes('```')) return true;

  // Marqueurs de code fréquents
  const codePatterns = [
    /^(const|let|var|function|class|import|export|type|interface)\s+\w+/m,
    /^(def|class|import|from)\s+\w+/m,
    /^(public|private|protected)\s+(class|void|int|String)/m,
    /^(package|func)\s+\w+/m,
    /^<\?php/m,
    /^(<!DOCTYPE|<html|<div|<button|<form|<template)/i,
    /^(SELECT|INSERT|UPDATE|DELETE|CREATE TABLE)\s+/i,
    /^(#include|using namespace)/m,
    /^(fn|let mut|pub struct|impl)/m,
    /\{[\s\S]{10,}\}/,
  ];

  return codePatterns.some((pattern) => pattern.test(trimmed));
}

/**
 * Met en valeur du code source via Prism avec la grammaire appropriée
 */
export function highlightSourceCode(code: string, languageId: string = 'typescript'): string {
  if (!code) return '';
  const lang =
    SUPPORTED_LANGUAGES.find((l) => l.id === languageId || l.prismGrammar === languageId) ||
    SUPPORTED_LANGUAGES[0];

  const grammar =
    Prism.languages[lang.prismGrammar] ||
    Prism.languages.typescript ||
    Prism.languages.javascript ||
    Prism.languages.markup;

  try {
    return Prism.highlight(code, grammar, lang.prismGrammar);
  } catch {
    // Fallback de sécurité si la grammaire échoue
    return code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
