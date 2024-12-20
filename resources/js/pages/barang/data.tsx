import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head } from "@inertiajs/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { Plus } from 'lucide-react';

// Define the shape of our data
interface Barang {
    id_barang: number;
    nama_barang: string;
    kategori: string;
    stok_awal: number;
    satuan: string;
}

export default function Dashboard() {
    const [data, setData] = useState<Barang[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        nama_barang: "",
        kategori: "",
        stok_awal: "",
        satuan: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get<Barang[]>('/api/barang');
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    // Handle input change
    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post<Barang>("/barang", formData);
            setData((prev) => [...prev, response.data]);
            setFormData({ nama_barang: "", kategori: "", stok_awal: "", satuan: "" }); // Reset the form
        } catch (error) {
            console.error("Error adding data:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-4 h-full">
                <Card className="flex flex-1 flex-col gap-4 h-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Data Barang</CardTitle>
                            <CardDescription>List inventory data barang.</CardDescription>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Tambah Data
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Tambah Data Barang</DialogTitle>
                                    <DialogDescription>
                                        Isi form berikut untuk menambah data barang baru.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nama_barang">Nama Barang</Label>
                                        <Input
                                            id="nama_barang"
                                            placeholder="Nama Barang"
                                            value={formData.nama_barang}
                                            onChange={(e) => handleInputChange("nama_barang", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="kategori">Kategori</Label>
                                        <Select
                                            onValueChange={(value) => handleInputChange("kategori", value)}
                                            value={formData.kategori}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kategori" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sarana_prasarana">Sarana Prasarana</SelectItem>
                                                <SelectItem value="barang_habis_pakai">Barang Habis Pakai</SelectItem>
                                                <SelectItem value="dapur_umum">Dapur Umum</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="stok_awal">Stok Awal</Label>
                                        <Input
                                            id="stok_awal"
                                            type="number"
                                            placeholder="Jumlah Stok"
                                            value={formData.stok_awal}
                                            onChange={(e) => handleInputChange("stok_awal", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="satuan">Satuan</Label>
                                        <Input
                                            id="satuan"
                                            placeholder="Satuan Barang"
                                            value={formData.satuan}
                                            onChange={(e) => handleInputChange("satuan", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={loading}>
                                            {loading ? "Menyimpan..." : "Simpan"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Nama Barang</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Stok</TableHead>
                                        <TableHead>Satuan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.length > 0 ? (
                                        data.map((item: any) => (
                                            <TableRow key={item.id_barang}>
                                                <TableCell>{item.id_barang}</TableCell>
                                                <TableCell>{item.nama_barang}</TableCell>
                                                <TableCell>{item.kategori}</TableCell>
                                                <TableCell>{item.stok_awal}</TableCell>
                                                <TableCell>{item.satuan}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center">
                                                Tidak ada data.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                <div className="flex-1 rounded-xl" />
            </div>

        </AuthenticatedLayout>
    );
}
