-- 初始化数据库脚本

-- 启用pgvector扩展
CREATE EXTENSION IF NOT EXISTS vector;

-- 创建基本索引（实体创建后会自动添加更多索引）
-- TypeORM会处理大部分索引创建

-- 设置默认搜索配置
CREATE TEXT SEARCH CONFIGURATION simple_cn (COPY = simple);

-- 预留：未来可添加更多初始化逻辑
