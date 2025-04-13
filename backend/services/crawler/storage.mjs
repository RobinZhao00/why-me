// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // 获取 data 目录路径
// const getDataDir = () => path.join(__dirname, '../data');

// // 确保目录存在
// const ensureDataDirExists = () => {
//   const dir = getDataDir();
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// };

// // 生成文件路径
// const getJsonFilePath = (filename) => {
//   const dateStr = new Date().toISOString().slice(0, 10);
//   return path.join(getDataDir(), `${filename}_${dateStr}.json`);
// };

// // 从文件读取 JSON 数组
// const readJsonArrayFromFile = (filePath) => {
//   if (!fs.existsSync(filePath)) return [];
//   try {
//     const content = fs.readFileSync(filePath, 'utf-8');
//     const parsed = JSON.parse(content);
//     return Array.isArray(parsed) ? parsed : [];
//   } catch (err) {
//     console.error(`❌ Failed to parse JSON at ${filePath}:`, err);
//     return [];
//   }
// };

// // 将数组写入文件
// const writeJsonArrayToFile = (filePath, data) => {
//   fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
// };

// // ✅ 追加数据（带主键判断，默认主键为 'id'）
// export const appendToJson = (data, filename = 'jobs', primaryKey = 'key') => {
//   ensureDataDirExists();
//   const filePath = getJsonFilePath(filename);
//   const existing = readJsonArrayFromFile(filePath);

//   const index = existing.findIndex(item => item?.[primaryKey] === data?.[primaryKey]);

//   if (index !== -1) {
//     // 覆盖
//     existing[index] = data;
//   } else {
//     // 新增
//     existing.push(data);
//   }

//   writeJsonArrayToFile(filePath, existing);
// };

// // ✅ 保存完整数组（整体覆盖）
// export const saveToJson = (data, filename = 'job_list') => {
//   ensureDataDirExists();
//   const filePath = getJsonFilePath(filename);
//   writeJsonArrayToFile(filePath, data);
//   return filePath;
// };


import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前模块的文件名和目录名
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取 data 目录路径
const getDataDir = () => path.join(__dirname, '../data');

// 确保 data 目录存在
const ensureDataDirExists = () => {
  const dir = getDataDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 生成 JSON 文件路径，文件名格式为：{filename}_YYYY-MM-DD.json
const getJsonFilePath = (filename) => {
  const dateStr = new Date().toISOString().slice(0, 10);
  return path.join(getDataDir(), `${filename}_${dateStr}.json`);
};

// 从文件读取 JSON 数组
const readJsonArrayFromFile = (filePath) => {
  if (!fs.existsSync(filePath)) return [];
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error(`❌ 解析 JSON 文件失败 ${filePath}:`, err);
    return [];
  }
};

// 将 JSON 数组写入文件
const writeJsonArrayToFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

// 保存数据到 JSON 文件，根据主键更新已有数据
export const saveToJson = (data, { filename = 'data', key = 'id' } = {}) => {
  if (!data || (typeof data !== 'object' && !Array.isArray(data))) {
    console.error('❌ 无效的数据类型，必须是对象或数组');
    return;
  }

  ensureDataDirExists();
  const filePath = getJsonFilePath(filename);
  const existingData = readJsonArrayFromFile(filePath);

  const dataMap = new Map();
  existingData.forEach(item => {
    if (item && item[key] !== undefined) {
      dataMap.set(item[key], item);
    }
  });

  const newDataArray = Array.isArray(data) ? data : [data];
  newDataArray.forEach(item => {
    if (item && item[key] !== undefined) {
      dataMap.set(item[key], item);
    }
  });

  const mergedArray = Array.from(dataMap.values());
  writeJsonArrayToFile(filePath, mergedArray);
  return filePath;
};
