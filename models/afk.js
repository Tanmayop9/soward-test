// AFK Model - JoshDB Implementation
class AfkModel {
    constructor(db) {
        this.db = db;
    }

    async findOne(query) {
        const key = `afk_${query.Member}_${query.$or ? 'any' : query.Guild || 'global'}`;
        
        if (query.$or) {
            // Check server-specific first
            const serverKey = `afk_${query.Member}_${query.$or[0].Guild}`;
            const serverData = await this.db.get(serverKey);
            if (serverData) return serverData;
            
            // Check global
            const globalKey = `afk_${query.Member}_global`;
            return await this.db.get(globalKey);
        }
        
        return await this.db.get(key);
    }

    async create(data) {
        const key = `afk_${data.Member}_${data.Guild || 'global'}`;
        await this.db.set(key, data);
        return { ...data, deleteOne: async () => await this.db.delete(key) };
    }

    async deleteOne(query) {
        const key = `afk_${query.Member}_${query.Guild || 'global'}`;
        await this.db.delete(key);
    }
}

module.exports = (db) => new AfkModel(db);
