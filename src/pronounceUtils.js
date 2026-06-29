export function normalizeText(s){
  return s
    .toLowerCase()
    .replace(/[\u2018\u2019\u201c\u201d]/g, "")
    .replace(/[^(\p{L}|\p{N}|\s|')]/gu, '')
    .trim()
}

export function levenshtein(a, b){
  if(!a) return b.length
  if(!b) return a.length
  const m = a.length, n = b.length
  const dp = Array(m+1).fill(null).map(()=>Array(n+1).fill(0))
  for(let i=0;i<=m;i++) dp[i][0]=i
  for(let j=0;j<=n;j++) dp[0][j]=j
  for(let i=1;i<=m;i++){
    for(let j=1;j<=n;j++){
      const cost = a[i-1] === b[j-1] ? 0 : 1
      dp[i][j] = Math.min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+cost)
    }
  }
  return dp[m][n]
}

export function compareWords(expectedWords, spokenWords){
  const results = []
  const len = Math.max(expectedWords.length, spokenWords.length)
  for(let i=0;i<len;i++){
    const exp = expectedWords[i] || ''
    const sp = spokenWords[i] || ''
    const d = levenshtein(exp, sp)
    const ratio = exp.length ? d/exp.length : sp.length?1:0
    results.push({expected: exp, spoken: sp, distance: d, ratio, ok: ratio <= 0.34})
  }
  return results
}
