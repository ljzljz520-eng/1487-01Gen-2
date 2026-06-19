export function formatDate(date: string | Date, format: string = 'YYYY-MM-DD'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

export function getGenderLabel(gender: 'male' | 'female' | 'other'): string {
  const labels = {
    male: '男',
    female: '女',
    other: '其他'
  };
  return labels[gender] || '';
}

export function getBloodTypeLabel(bloodType: string): string {
  const labels: Record<string, string> = {
    A: 'A型',
    B: 'B型',
    AB: 'AB型',
    O: 'O型',
    unknown: '未知'
  };
  return labels[bloodType] || bloodType;
}

export function getMaritalStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    single: '未婚',
    married: '已婚',
    divorced: '离异',
    widowed: '丧偶',
    unknown: '未知'
  };
  return labels[status] || status;
}

export function getSeverityLabel(severity: string): string {
  const labels: Record<string, string> = {
    mild: '轻度',
    moderate: '中度',
    severe: '重度'
  };
  return labels[severity] || severity;
}

export function getAllergyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    drug: '药物过敏',
    food: '食物过敏',
    other: '其他过敏'
  };
  return labels[type] || type;
}

export function formatCurrency(amount: number): string {
  return `¥${amount.toFixed(2)}`;
}

export function calculateAge(idCard: string): number | null {
  if (!/^\d{17}[\dXx]$/.test(idCard)) return null;
  
  const birthYear = parseInt(idCard.slice(6, 10));
  const birthMonth = parseInt(idCard.slice(10, 12));
  const birthDay = parseInt(idCard.slice(12, 14));
  
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  
  let age = currentYear - birthYear;
  
  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
    age--;
  }
  
  return age >= 0 ? age : null;
}

export function getGenderFromIdCard(idCard: string): 'male' | 'female' | null {
  if (!/^\d{17}[\dXx]$/.test(idCard)) return null;
  
  const genderCode = parseInt(idCard.slice(16, 17));
  return genderCode % 2 === 1 ? 'male' : 'female';
}

export function generateId(prefix: string = ''): string {
  return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
