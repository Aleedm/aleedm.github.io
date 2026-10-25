export function createProgram(gl: WebGL2RenderingContext, vertex: string, fragment: string) {
  const shaders: WebGLShader[] = [];
  const program = gl.createProgram();
  if (!program) throw new Error('Cannot allocate shader program');
  const dispose = () => {
    shaders.forEach((shader) => gl.deleteShader(shader));
    gl.deleteProgram(program);
  };
  try {
    for (const [type, source] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]] as const) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('Cannot allocate shader');
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'Shader compilation failed');
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Shader link failed');
    return { program, dispose };
  } catch (error) { dispose(); throw error; }
}

export function createTexture(gl: WebGL2RenderingContext, unit: number) {
  const texture = gl.createTexture();
  if (!texture) throw new Error('Cannot allocate texture');
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
  return texture;
}
