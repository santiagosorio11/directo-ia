import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const restaurantId = req.nextUrl.searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json({ error: "restaurantId is required" }, { status: 400 });
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30).toISOString();

    // Fetch all orders for the last 30 days
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("total, items, pipeline_stage, payment_status, created_at")
      .eq("restaurant_id", restaurantId)
      .gte("created_at", monthStart)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const allOrders = orders || [];

    // Filter by time periods
    const todayOrders = allOrders.filter((o) => o.created_at >= todayStart);
    const yesterdayOrders = allOrders.filter(
      (o) => o.created_at >= yesterdayStart && o.created_at < todayStart
    );
    const weekOrders = allOrders.filter((o) => o.created_at >= weekStart);

    // Calculate KPIs
    const todaySales = todayOrders.reduce((s, o) => s + (Number(o.total) || 0), 0);
    const yesterdaySales = yesterdayOrders.reduce((s, o) => s + (Number(o.total) || 0), 0);
    const weekSales = weekOrders.reduce((s, o) => s + (Number(o.total) || 0), 0);

    const todayCount = todayOrders.length;
    const yesterdayCount = yesterdayOrders.length;

    const avgTicket = todayCount > 0 ? todaySales / todayCount : 0;
    const yesterdayAvgTicket = yesterdayCount > 0 ? yesterdaySales / yesterdayCount : 0;

    // Daily breakdown for last 7 days
    const dailySales: { date: string; label: string; total: number; count: number }[] = [];
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dStart = d.toISOString();
      const dEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).toISOString();
      const dayOrders = allOrders.filter((o) => o.created_at >= dStart && o.created_at < dEnd);

      dailySales.push({
        date: d.toISOString().split("T")[0],
        label: dayNames[d.getDay()],
        total: dayOrders.reduce((s, o) => s + (Number(o.total) || 0), 0),
        count: dayOrders.length,
      });
    }

    // Top products
    const productCounts: Record<string, { name: string; count: number; revenue: number }> = {};
    allOrders.forEach((o) => {
      const items = Array.isArray(o.items) ? o.items : [];
      items.forEach((item: any) => {
        const name = item.name || "Desconocido";
        if (!productCounts[name]) productCounts[name] = { name, count: 0, revenue: 0 };
        productCounts[name].count += item.quantity || 1;
        productCounts[name].revenue += (item.price || 0) * (item.quantity || 1);
      });
    });

    const topProducts = Object.values(productCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      today: {
        sales: todaySales,
        orders: todayCount,
        avgTicket: Math.round(avgTicket),
      },
      yesterday: {
        sales: yesterdaySales,
        orders: yesterdayCount,
        avgTicket: Math.round(yesterdayAvgTicket),
      },
      week: {
        sales: weekSales,
        orders: weekOrders.length,
      },
      dailySales,
      topProducts,
      totalOrders30d: allOrders.length,
    });
  } catch (error: any) {
    console.error("Metrics API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
