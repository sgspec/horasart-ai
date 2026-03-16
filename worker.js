export default {
  async fetch(request, env) {

    // รับค่าคำฝันจาก URL
    const url = new URL(request.url);
    const dream = url.searchParams.get("dream") || "ฝันเห็นงู";

    try {

      // เรียก Gemini API
      const response = await fetch(

"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=" + env.GEMINI_KEY,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
text: "ทำนายฝัน '" + dream + "' สรุปแบบสั้นๆ พร้อมเลขมงคล 3 ตัว (เน้นเลขเด่น 1 ชุด และเลขรอง 2-3 ชุด) ปิดท้ายด้วยหมายเหตุว่าเป็นความเชื่อส่วนบุคคล และไม่ต้องมีประโยคคำถามหรือคำชวนคุยปิดท้าย"

              }]
            }]
          })
        }
      );

      // แปลง response เป็น JSON
      const data = await response.json();

      // ดึงข้อความคำทำนายจาก Gemini
      const result =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "AI ไม่ตอบกลับ";

      // ส่งผลลัพธ์กลับ
      return new Response(result, {
        headers: {
          "Content-Type": "text/plain; charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (error) {

      return new Response("เกิดข้อผิดพลาด: " + error.message, {
        headers: {
          "Content-Type": "text/plain; charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        }
      });

    }

  }
};
 
