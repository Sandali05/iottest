function gaussianSolve(A, b) {
  const n = b.length;
  const matrix = A.map((row) => [...row]);
  const vec = [...b];

  for (let i = 0; i < n; i += 1) {
    let maxRow = i;
    for (let k = i + 1; k < n; k += 1) {
      if (Math.abs(matrix[k][i]) > Math.abs(matrix[maxRow][i])) maxRow = k;
    }

    if (Math.abs(matrix[maxRow][i]) < 1e-9) {
      return Array(n).fill(0);
    }

    [matrix[i], matrix[maxRow]] = [matrix[maxRow], matrix[i]];
    [vec[i], vec[maxRow]] = [vec[maxRow], vec[i]];

    for (let k = i + 1; k < n; k += 1) {
      const factor = matrix[k][i] / matrix[i][i];
      for (let j = i; j < n; j += 1) {
        matrix[k][j] -= factor * matrix[i][j];
      }
      vec[k] -= factor * vec[i];
    }
  }

  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i -= 1) {
    x[i] = vec[i] / matrix[i][i];
    for (let k = i - 1; k >= 0; k -= 1) {
      vec[k] -= matrix[k][i] * x[i];
    }
  }

  return x;
}

function solveLinearRegression(X, Y) {
  if (!X.length) return [];

  const n = X.length;
  const p = X[0].length;
  const Xb = X.map((row) => [1, ...row]);

  const XtX = Array.from({ length: p + 1 }, () => Array(p + 1).fill(0));
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j <= p; j += 1) {
      for (let k = 0; k <= p; k += 1) {
        XtX[j][k] += Xb[i][j] * Xb[i][k];
      }
    }
  }

  const XtY = Array(p + 1).fill(0);
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j <= p; j += 1) {
      XtY[j] += Xb[i][j] * Y[i];
    }
  }

  return gaussianSolve(XtX, XtY);
}

export function arForecastTemperature(series = [], points = 6, stepMinutes = 10, lag = 3) {
  const base = series.slice().reverse();
  if (base.length < lag + 1) return [];

  const values = base.map((d) => Number(d.temperature ?? 0));
  const X = [];
  const Y = [];

  for (let i = lag; i < values.length; i += 1) {
    X.push(values.slice(i - lag, i));
    Y.push(values[i]);
  }

  const coeffs = solveLinearRegression(X, Y);
  if (!coeffs.length) return [];

  const start = base[base.length - 1]?.timestampMs || Date.now();
  const history = values.slice(-lag);
  const forecast = [];

  for (let i = 0; i < points; i += 1) {
    let next = coeffs[0];

    for (let j = 0; j < lag; j += 1) {
      next += coeffs[j + 1] * history[lag - j - 1];
    }

    const projected = Number(next.toFixed(1));
    history.push(projected);
    history.shift();

    forecast.push({
      step: i + 1,
      minute: (i + 1) * stepMinutes,
      time: new Date(start + (i + 1) * stepMinutes * 60000).toLocaleTimeString(),
      temperature: projected,
    });
  }

  return forecast;
}
