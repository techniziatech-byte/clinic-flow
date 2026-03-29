import { useInventoryStore } from '@/stores/inventoryStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, Layers } from 'lucide-react';
import { useState } from 'react';

const Inventory = () => {
  const { rawMaterials, finishedProducts, loading, fetchInventory, convertToFinished, updateStock } = useInventoryStore();
  const [newProduct, setNewProduct] = useState({ name: '', quantity: 1, costPrice: 0, sellPrice: 0 });

  const handleConvert = () => {
    // Example: convert first raw material to finished
    const rawIds = rawMaterials.slice(0, 1).map(r => r.id);
    convertToFinished(rawIds, newProduct);
    setNewProduct({ name: '', quantity: 1, costPrice: 0, sellPrice: 0 });
  };

  if (loading) return <div>Loading inventory...</div>;

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center gap-4">
        <Package className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Warehouse A (Raw) → Warehouse B (Finished)</p>
        </div>
        <Button onClick={fetchInventory} variant="outline">
          <Layers className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Raw Materials */}
        <Card>
          <CardHeader>
            <CardTitle>Warehouse A - Raw Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rawMaterials.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.quantity} {item.unit}</p>
                  </div>
                  <Badge>{item.quantity > 10 ? 'Stock OK' : 'Low Stock'}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Finished Products */}
        <Card>
          <CardHeader>
            <CardTitle>Warehouse B - Finished Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {finishedProducts.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} units | Sell: Rs.{item.sellPrice}
                    </p>
                  </div>
                  <Badge variant="secondary">Rs.{item.costPrice}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Convert Form */}
      <Card>
        <CardHeader>
          <CardTitle>Convert Raw → Finished</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              placeholder="Product Name (Glow Inn Soap)"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value)})}
            />
            <Input
              type="number"
              placeholder="Cost Price"
              value={newProduct.costPrice}
              onChange={(e) => setNewProduct({...newProduct, costPrice: parseFloat(e.target.value)})}
            />
            <Input
              type="number"
              placeholder="Sell Price"
              value={newProduct.sellPrice}
              onChange={(e) => setNewProduct({...newProduct, sellPrice: parseFloat(e.target.value)})}
            />
          </div>
          <Button onClick={handleConvert} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Convert & Add to Finished
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;

