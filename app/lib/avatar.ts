const COLORS = [
  '#2196F3', // 蓝色
  '#009688', // 青色
  '#9C27B0', // 紫色
  '#F44336', // 红色
  '#673AB7', // 深紫色
  '#3F51B5', // 靛蓝
  '#4CAF50', // 绿色
  '#FF5722', // 深橙
  '#795548', // 棕色
  '#607D8B', // 蓝灰
];

export function generateAvatarUrl(name: string): string {
  const initial = name[0].toUpperCase();
  
  const colorIndex = Array.from(name).reduce(
    (acc, char) => acc + char.charCodeAt(0), 0
  ) % COLORS.length;
  
  const backgroundColor = COLORS[colorIndex];
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="${backgroundColor}"/>
      <text 
        x="50%" 
        y="50%" 
        fill="white" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="45" 
        font-weight="500"
        text-anchor="middle"
        alignment-baseline="central"
        dominant-baseline="central"
        style="text-transform: uppercase"
      >
        ${initial}
      </text>
    </svg>
  `.trim();

  const encoder = new TextEncoder();
  const bytes = encoder.encode(svg);
  const base64 = Buffer.from(bytes).toString('base64');
  
  return `data:image/svg+xml;base64,${base64}`;
} 
