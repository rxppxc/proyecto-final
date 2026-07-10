import type { Connection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import type { IProductRepository } from '../../domain/repositories/IProductRepository';
import type { Product } from '../../domain/entities/Product';

// Tipo auxiliar para las filas que retorna MySQL
interface ProductRow extends RowDataPacket {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  stock_minimo: number;
  categoria_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export class MySQLProductRepository implements IProductRepository {
  // Conexión inyectada desde app.ts
  constructor(private readonly connection: Connection) {}

  // ─── Retorna todos los productos con JOIN a categorias ──────────────────────
  async findAll(): Promise<Product[]> {
    try {
      const [filas] = await this.connection.execute<ProductRow[]>(`
        SELECT
          p.id,
          p.nombre,
          p.descripcion,
          p.precio,
          p.stock,
          p.stock_minimo,
          p.categoria_id,
          p.created_at,
          p.updated_at
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
      `);
      return filas.map((fila: ProductRow) => ({ ...fila }));
    } catch (error) {
      console.error('MySQLProductRepository.findAll falló:', error);
      throw error;
    }
  }

  // ─── Busca un producto por ID con JOIN a categorias ─────────────────────────
  async findById(id: number): Promise<Product | null> {
    try {
      const [filas] = await this.connection.execute<ProductRow[]>(
        `SELECT
          p.id,
          p.nombre,
          p.descripcion,
          p.precio,
          p.stock,
          p.stock_minimo,
          p.categoria_id,
          p.created_at,
          p.updated_at
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        WHERE p.id = ?`,
        [id]
      );
      if (filas.length === 0) return null;
      return { ...filas[0] };
    } catch (error) {
      console.error(`MySQLProductRepository.findById (id=${id}) falló:`, error);
      throw error;
    }
  }

  // ─── Retorna productos con stock > 0 ────────────────────────────────────────
  async findAvailable(): Promise<Product[]> {
    try {
      const [filas] = await this.connection.execute<ProductRow[]>(`
        SELECT
          p.id,
          p.nombre,
          p.descripcion,
          p.precio,
          p.stock,
          p.stock_minimo,
          p.categoria_id,
          p.created_at,
          p.updated_at
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        WHERE p.stock > 0
      `);
      return filas.map((fila: ProductRow) => ({ ...fila }));
    } catch (error) {
      console.error('MySQLProductRepository.findAvailable falló:', error);
      throw error;
    }
  }

  // ─── Retorna productos con stock < stock_minimo ──────────────────────────────
  async findLowStock(): Promise<Product[]> {
    try {
      const [filas] = await this.connection.execute<ProductRow[]>(`
        SELECT
          p.id,
          p.nombre,
          p.descripcion,
          p.precio,
          p.stock,
          p.stock_minimo,
          p.categoria_id,
          p.created_at,
          p.updated_at
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        WHERE p.stock < p.stock_minimo
      `);
      return filas.map((fila: ProductRow) => ({ ...fila }));
    } catch (error) {
      console.error('MySQLProductRepository.findLowStock falló:', error);
      throw error;
    }
  }

  // ─── Crea un producto y retorna la entidad con el ID generado ───────────────
  async create(producto: Product): Promise<Product> {
    try {
      const [resultado] = await this.connection.execute<ResultSetHeader>(
        `INSERT INTO productos (nombre, descripcion, precio, stock, stock_minimo, categoria_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          producto.nombre,
          producto.descripcion,
          producto.precio,
          producto.stock,
          producto.stock_minimo,
          producto.categoria_id,
        ]
      );

      // Recuperamos el producto completo con el ID generado
      const productoCreado = await this.findById(resultado.insertId);
      if (!productoCreado) {
        throw new Error('No se pudo recuperar el producto recién creado');
      }
      return productoCreado;
    } catch (error) {
      console.error('MySQLProductRepository.create falló:', error);
      throw error;
    }
  }

  // ─── Actualiza solo los campos enviados ─────────────────────────────────────
  async update(id: number, campos: Partial<Product>): Promise<Product | null> {
    try {
      // Columnas permitidas para evitar inyección SQL
      const columnasMapeadas: Record<string, string> = {
        nombre: 'nombre',
        descripcion: 'descripcion',
        precio: 'precio',
        stock: 'stock',
        stock_minimo: 'stock_minimo',
        categoria_id: 'categoria_id',
      };

      const setClauses: string[] = [];
      const valores: any[] = [];

      for (const [clave, valor] of Object.entries(campos)) {
        const columna = columnasMapeadas[clave];
        if (columna && valor !== undefined) {
          setClauses.push(`${columna} = ?`);
          valores.push(valor);
        }
      }

      // Si no llegan campos válidos retornamos el producto sin modificar
      if (setClauses.length === 0) return this.findById(id);

      valores.push(id);

      await this.connection.execute<ResultSetHeader>(
        `UPDATE productos SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = ?`,
        valores
      );

      return this.findById(id);
    } catch (error) {
      console.error(`MySQLProductRepository.update (id=${id}) falló:`, error);
      throw error;
    }
  }

  // ─── Elimina un producto por ID ─────────────────────────────────────────────
  async delete(id: number): Promise<boolean> {
    try {
      const [resultado] = await this.connection.execute<ResultSetHeader>(
        'DELETE FROM productos WHERE id = ?',
        [id]
      );
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error(`MySQLProductRepository.delete (id=${id}) falló:`, error);
      throw error;
    }
  }
}
