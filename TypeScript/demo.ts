const COLOR_MAP = {
  red: '红色',
  blue: '蓝色',
  green: '绿色',
};
const color: string = 'red';
const result = COLOR_MAP[color as keyof typeof COLOR_MAP];
