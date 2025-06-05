import React from 'react';

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.slogan}>Padaria Doce Pão</div>
      <nav style={styles.nav}>
        <a href="/receitas" style={styles.link}>Receitas</a>
        <a href="/produtos" style={styles.link}>Produtos</a>
        <a href="/dashboard" style={styles.link}>Inícios</a>
        <a href="/suporte" style={styles.link}>Suporte</a>
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
    backgroundColor: '#f8b400',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
  },
  slogan: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
  },
  nav: {
    display: 'flex',
    gap: '1.5rem',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '500',
  },
};