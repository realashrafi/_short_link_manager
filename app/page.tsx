import { getLinks } from "@/lib/db/queries";
import {ShortLinkForm} from "@/components/ShortLinkForm";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function Home() {
  const links = await getLinks();

  return (
      <main className="container mx-auto p-8 max-w-4xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>کوتاه‌کننده لینک</CardTitle>
          </CardHeader>
          <CardContent>
            <ShortLinkForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>لینک‌های اخیر</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>عنوان</TableHead>
                  <TableHead>اسلاگ</TableHead>
                  <TableHead>کلیک</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell>{link.title}</TableCell>
                      <TableCell className="font-mono text-blue-600">
                        {link.shortSlug}
                      </TableCell>
                      <TableCell>{link.clickCount}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
  );
}
