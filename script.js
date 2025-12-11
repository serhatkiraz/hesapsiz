
// ----------------------------
//  LARGE NUMBER CALCULATION ENGINE
// ----------------------------
function clean(n) {
  return n.replace(/\s+/g, "").replace(/^0+(?=\d)/, "");
}

function cmp(a, b) {
  a = clean(a);
  b = clean(b);
  if (a.length !== b.length) return a.length > b.length ? 1 : -1;
  if (a === b) return 0;
  return a > b ? 1 : -1;
}

function add(a, b) {
  a = clean(a);
  b = clean(b);
  let res = "", carry = 0;
  a = a.split("").reverse();
  b = b.split("").reverse();
  let m = Math.max(a.length, b.length);
  for (let i = 0; i < m; i++) {
    let x = parseInt(a[i] || "0");
    let y = parseInt(b[i] || "0");
    let s = x + y + carry;
    res = (s % 10) + res;
    carry = Math.floor(s / 10);
  }
  if (carry) res = carry + res;
  return res;
}

function sub(a, b) {
  a = clean(a);
  b = clean(b);
  if (cmp(a, b) === 0) return "0";
  let res = "", borrow = 0;
  a = a.split("").reverse();
  b = b.split("").reverse();
  for (let i = 0; i < a.length; i++) {
    let x = parseInt(a[i]);
    let y = parseInt(b[i] || "0");
    x -= borrow;
    if (x < y) {
      x += 10;
      borrow = 1;
    } else borrow = 0;
    res = (x - y) + res;
  }
  return clean(res);
}

function mul(a, b) {
  a = clean(a);
  b = clean(b);
  if (a === "0" || b === "0") return "0";
  let A = a.split("").reverse();
  let B = b.split("").reverse();
  let res = Array(a.length + b.length).fill(0);
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < B.length; j++) {
      res[i + j] += parseInt(A[i]) * parseInt(B[j]);
    }
  }
  for (let i = 0; i < res.length; i++) {
    if (res[i] >= 10) {
      res[i + 1] += Math.floor(res[i] / 10);
      res[i] %= 10;
    }
  }
  while (res.length > 1 && res[res.length - 1] === 0) res.pop();
  return res.reverse().join("");
}

function div(a, b) {
  a = clean(a);
  b = clean(b);
  if (b === "0") return "Undefined";
  if (cmp(a, b) < 0) return "0";
  let result = "", cur = "";
  for (let digit of a) {
    cur += digit;
    cur = clean(cur);
    let count = 0;
    while (cmp(cur, b) >= 0) {
      cur = sub(cur, b);
      count++;
    }
    result += count.toString();
  }
  return clean(result);
}

// ----------------------------
//  UI FUNCTIONS
// ----------------------------
function calc(type) {
  let A = document.getElementById("numA").value.trim();
  let B = document.getElementById("numB").value.trim();
  let out = document.getElementById("result");
  
  if (!A || !B) {
    out.innerHTML = "<span style='color: #ff6b6b;'><i class='fas fa-exclamation-triangle'></i> Please enter both numbers.</span>";
    return;
  }
  
  let result;
  switch (type) {
    case "add":
      result = add(A, B);
      break;
    case "sub":
      result = cmp(A, B) >= 0 ? sub(A, B) : "-" + sub(B, A);
      break;
    case "mul":
      result = mul(A, B);
      break;
    case "div":
      result = div(A, B);
      break;
  }
  
  out.innerHTML = `<span style="color: var(--secondary); font-weight: 600;">${result}</span>`;
  
  // Format için karakter sayısını göster
  const charCount = result.toString().length;
  out.innerHTML += `<br><small style="opacity: 0.7; font-size: 0.9rem;">(${charCount} digits)</small>`;
}

function resetAll() {
  document.getElementById("numA").value = "";
  document.getElementById("numB").value = "";
  document.getElementById("result").innerHTML = "<i class='fas fa-info-circle'></i> No calculation performed yet.";
}

function copyResult() {
  const resultElement = document.getElementById("result");
  const resultText = resultElement.textContent.split('(')[0].trim(); // Sadece sonucu al
  
  if (resultText && resultText !== "No calculation performed yet.") {
    navigator.clipboard.writeText(resultText)
      .then(() => {
        const copyBtn = document.querySelector('.btn-copy');
        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.style.background = 'rgba(76, 175, 80, 0.3)';
        
        setTimeout(() => {
          copyBtn.innerHTML = originalHtml;
          copyBtn.style.background = '';
        }, 2000);
      })
      .catch(err => {
        alert('Failed to copy: ' + err);
      });
  }
}
