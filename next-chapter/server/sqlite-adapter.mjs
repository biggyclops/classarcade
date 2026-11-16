export function adapter(sqlite) {
  return {
    prepare(sql) {
      return {
        bind(...values) {
          return {
            async first() { return sqlite.prepare(sql).get(...values) || null; },
            async all() { return { results: sqlite.prepare(sql).all(...values) }; },
            async run() { const r = sqlite.prepare(sql).run(...values); return { meta: { changes: r.changes } }; }
          };
        }
      };
    },
    async batch(stmts) {
      sqlite.exec('BEGIN');
      try { const r=[]; for (const stmt of stmts) r.push(await stmt.run()); sqlite.exec('COMMIT'); return r; }
      catch (error) { sqlite.exec('ROLLBACK'); throw error; }
    }
  };
}
