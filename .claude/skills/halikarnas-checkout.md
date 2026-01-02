# Skill: Halikarnas Checkout Patterns

## Bu Skill Ne Zaman Kullanilir

- Checkout formu degisiklikleri
- Adres/teslimat form islemleri
- Siparis tamamlama akisi
- Email bildirimleri
- Odeme entegrasyonu
- Il/ilce dropdown islemleri

---

## Form Validation with Zod

### Shipping Form Schema

```typescript
// src/lib/validations/checkout.ts
import { z } from "zod";

export const shippingSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmali"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmali"),
  email: z.string().email("Gecerli email girin"),
  phone: z.string()
    .min(10, "Gecerli telefon numarasi girin")
    .regex(/^[0-9]+$/, "Sadece rakam girin"),
  city: z.string().min(1, "Il seciniz"),
  district: z.string().min(1, "Ilce seciniz"),
  neighborhood: z.string().min(2, "Mahalle en az 2 karakter olmali"),
  address: z.string().min(10, "Adres en az 10 karakter olmali"),
  postalCode: z.string().optional(),
  note: z.string().optional(),
});

export type ShippingFormData = z.infer<typeof shippingSchema>;
```

### React Hook Form Integration

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingSchema, ShippingFormData } from "@/lib/validations/checkout";
import { useCheckoutStore } from "@/stores/checkout-store";

export function ShippingForm() {
  const checkoutStore = useCheckoutStore();

  const form = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: checkoutStore.shippingInfo || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      district: "",
      neighborhood: "",
      address: "",
      postalCode: "",
      note: "",
    },
  });

  const onSubmit = async (data: ShippingFormData) => {
    checkoutStore.setShippingInfo(data);
    checkoutStore.nextStep();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  );
}
```

### Form Field Pattern

```tsx
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

<FormField
  control={form.control}
  name="firstName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Ad *</FormLabel>
      <FormControl>
        <Input
          placeholder="Adinizi girin"
          {...field}
          className="bg-white border-luxury-stone focus:border-luxury-gold focus:ring-luxury-gold/20"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## Cascading Dropdowns (City/District)

### API Endpoints

| Endpoint | Method | Response |
|----------|--------|----------|
| `/api/locations/cities` | GET | `{ cities: [{ id, name }] }` |
| `/api/locations/districts?city={cityName}` | GET | `{ districts: [{ id, name }] }` |

### Implementation Pattern

```typescript
"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";

export function CityDistrictFields() {
  const form = useFormContext();
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);

  const selectedCity = form.watch("city");

  // Load cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("/api/locations/cities");
        const data = await res.json();
        setCities(data.cities);
      } catch (error) {
        console.error("Failed to load cities:", error);
      } finally {
        setIsLoadingCities(false);
      }
    };
    fetchCities();
  }, []);

  // Load districts when city changes
  useEffect(() => {
    if (!selectedCity) {
      setDistricts([]);
      return;
    }

    const fetchDistricts = async () => {
      setIsLoadingDistricts(true);
      form.setValue("district", ""); // Reset district selection

      try {
        const res = await fetch(`/api/locations/districts?city=${encodeURIComponent(selectedCity)}`);
        const data = await res.json();
        setDistricts(data.districts);
      } catch (error) {
        console.error("Failed to load districts:", error);
      } finally {
        setIsLoadingDistricts(false);
      }
    };
    fetchDistricts();
  }, [selectedCity, form]);

  return (
    <>
      {/* City Select */}
      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Il *</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={isLoadingCities}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingCities ? "Yukleniyor..." : "Il seciniz"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* District Select */}
      <FormField
        control={form.control}
        name="district"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ilce *</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={!selectedCity || isLoadingDistricts}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !selectedCity
                        ? "Once il seciniz"
                        : isLoadingDistricts
                        ? "Yukleniyor..."
                        : "Ilce seciniz"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district.id} value={district.name}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
```

### Data Source

```typescript
// src/lib/turkey-locations.ts
// Turkiye il ve ilce verileri
export const cities = [
  { id: "1", name: "Adana" },
  { id: "2", name: "Adiyaman" },
  // ... 81 il
  { id: "48", name: "Mugla" },
  // ...
];

export const districtsByCity: Record<string, string[]> = {
  "Mugla": ["Bodrum", "Dalaman", "Datca", "Fethiye", "Koycegiz", "Marmaris", "Mentese", "Milas", "Ortaca", "Seydikemer", "Ula", "Yatagan"],
  "Istanbul": ["Kadikoy", "Besiktas", "Sisli", "Uskudar", /* ... */],
  // ...
};
```

---

## Order Completion Redirect Flow

### Security: trackingToken vs orderNumber

**ONEMLI:** URL'de `orderNumber` KULLANMA! `orderNumber` sirali ve tahmin edilebilir (HS-2024-0001, HS-2024-0002...). Bunun yerine `trackingToken` (UUID) kullan.

### Order Creation with trackingToken

```typescript
// src/app/api/orders/route.ts
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  // ... validation, stock check, etc.

  const order = await db.order.create({
    data: {
      orderNumber: generateOrderNumber(), // HS-2024-0001 (internal use)
      trackingToken: randomUUID(),        // UUID (public URL'de kullan)
      status: "PENDING",
      paymentStatus: "PENDING",
      // ... other fields
    },
  });

  // Clear cart and checkout store
  // Send confirmation email

  return NextResponse.json({
    success: true,
    trackingToken: order.trackingToken,  // Frontend'e token dondur
  });
}
```

### Frontend Redirect

```typescript
// src/components/checkout/OrderReview.tsx
const handlePlaceOrder = async () => {
  setIsSubmitting(true);

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shippingInfo: checkoutStore.shippingInfo,
        paymentMethod: checkoutStore.paymentMethod,
        items: cartStore.items,
        couponCode: cartStore.coupon?.code,
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Clear stores
      cartStore.clearCart();
      checkoutStore.reset();

      // Redirect with trackingToken (NOT orderNumber!)
      router.push(`/siparis-tamamlandi?token=${data.trackingToken}`);
    }
  } catch (error) {
    toast({
      title: "Hata",
      description: "Siparis olusturulurken bir hata olustu",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};
```

### Success Page

```typescript
// src/app/(shop)/siparis-tamamlandi/page.tsx
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const { token } = params;

  if (!token) {
    notFound();
  }

  const order = await db.order.findUnique({
    where: { trackingToken: token },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="bg-luxury-cream min-h-screen py-16">
      <div className="container max-w-2xl mx-auto px-4 text-center">
        {/* Success icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-600" />
        </div>

        <h1 className="font-serif text-3xl text-luxury-charcoal mb-4">
          Siparissiniz Alindi!
        </h1>

        <p className="text-luxury-charcoal/70 mb-8">
          Siparis numaraniz: <strong>{order.orderNumber}</strong>
        </p>

        {/* Order details */}
        <OrderDetails order={order} />
      </div>
    </div>
  );
}
```

---

## Email Integration with Resend

### Setup

```bash
npm install resend
```

```env
# .env
RESEND_API_KEY=re_xxxxxxxx
```

### Resend Client

```typescript
// src/lib/resend.ts
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);
```

### Order Confirmation Email

```typescript
// src/app/api/orders/route.ts
import { resend } from "@/lib/resend";
import { OrderConfirmationEmail } from "@/emails/order-confirmation";

// After order creation
try {
  await resend.emails.send({
    from: "Halikarnas Sandals <siparis@halikarnas.com>",
    to: order.guestEmail || order.user?.email,
    subject: `Siparis Onayiniz - #${order.orderNumber}`,
    react: OrderConfirmationEmail({
      orderNumber: order.orderNumber,
      customerName: `${order.shippingFirstName} ${order.shippingLastName}`,
      items: order.items,
      total: order.total,
      shippingAddress: {
        address: order.shippingAddress,
        city: order.shippingCity,
        district: order.shippingDistrict,
      },
    }),
  });
} catch (emailError) {
  // Log but don't fail order
  console.error("Failed to send confirmation email:", emailError);
}
```

### Email Template (React Email)

```typescript
// src/emails/order-confirmation.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  items: Array<{
    productName: string;
    variantSize: string;
    variantColor: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingAddress: {
    address: string;
    city: string;
    district: string;
  };
}

export function OrderConfirmationEmail({
  orderNumber,
  customerName,
  items,
  total,
  shippingAddress,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Siparissiniz alindi - #{orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Img
            src="https://halikarnas.com/logo.png"
            width="150"
            alt="Halikarnas Sandals"
            style={logo}
          />

          <Heading style={heading}>
            Tesekkurler, {customerName}!
          </Heading>

          <Text style={paragraph}>
            Siparissiniz basariyla alindi. Siparis numaraniz:
          </Text>

          <Text style={orderNumberStyle}>
            #{orderNumber}
          </Text>

          {/* Order items */}
          <Section style={itemsSection}>
            <Heading as="h2" style={subheading}>
              Siparis Detaylari
            </Heading>
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column>
                  <Text style={itemName}>{item.productName}</Text>
                  <Text style={itemDetails}>
                    {item.variantSize} / {item.variantColor} x {item.quantity}
                  </Text>
                </Column>
                <Column align="right">
                  <Text style={itemPrice}>
                    {formatPrice(item.price * item.quantity)}
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>

          {/* Total */}
          <Section style={totalSection}>
            <Row>
              <Column>
                <Text style={totalLabel}>Toplam</Text>
              </Column>
              <Column align="right">
                <Text style={totalAmount}>{formatPrice(total)}</Text>
              </Column>
            </Row>
          </Section>

          {/* Shipping address */}
          <Section style={addressSection}>
            <Heading as="h2" style={subheading}>
              Teslimat Adresi
            </Heading>
            <Text style={paragraph}>
              {shippingAddress.address}
              <br />
              {shippingAddress.district}, {shippingAddress.city}
            </Text>
          </Section>

          {/* Footer */}
          <Text style={footer}>
            Sorulariniz icin bize info@halikarnas.com adresinden ulasabilirsiniz.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#faf9f6",
  fontFamily: "Inter, sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
};

const logo = {
  margin: "0 auto 24px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#2d2d2d",
  textAlign: "center" as const,
};

// ... more styles
```

### Email Types

| Email | Trigger | Template |
|-------|---------|----------|
| Order Confirmation | Order created | `order-confirmation.tsx` |
| Shipping Notification | Status → SHIPPED | `shipping-notification.tsx` |
| Password Reset | Forgot password | `password-reset.tsx` |
| Welcome | New registration | `welcome.tsx` |

---

## Checkout Store (Zustand)

### Store Definition

```typescript
// src/stores/checkout-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  neighborhood: string;
  address: string;
  postalCode?: string;
  note?: string;
}

type PaymentMethod = "card" | "cash_on_delivery";

interface CheckoutState {
  currentStep: 1 | 2 | 3;
  shippingInfo: ShippingInfo | null;
  paymentMethod: PaymentMethod;
  acceptedTerms: boolean;
  acceptedKvkk: boolean;
  isOrderCompleted: boolean;
}

interface CheckoutActions {
  setStep: (step: 1 | 2 | 3) => void;
  nextStep: () => void;
  prevStep: () => void;
  setShippingInfo: (info: ShippingInfo) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setAcceptedTerms: (accepted: boolean) => void;
  setAcceptedKvkk: (accepted: boolean) => void;
  setOrderCompleted: (completed: boolean) => void;
  reset: () => void;

  // Computed
  canProceedToPayment: () => boolean;
  canProceedToReview: () => boolean;
  canPlaceOrder: () => boolean;
}

const initialState: CheckoutState = {
  currentStep: 1,
  shippingInfo: null,
  paymentMethod: "cash_on_delivery",
  acceptedTerms: false,
  acceptedKvkk: false,
  isOrderCompleted: false,
};

export const useCheckoutStore = create<CheckoutState & CheckoutActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const current = get().currentStep;
        if (current < 3) {
          set({ currentStep: (current + 1) as 1 | 2 | 3 });
        }
      },

      prevStep: () => {
        const current = get().currentStep;
        if (current > 1) {
          set({ currentStep: (current - 1) as 1 | 2 | 3 });
        }
      },

      setShippingInfo: (info) => set({ shippingInfo: info }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setAcceptedTerms: (accepted) => set({ acceptedTerms: accepted }),
      setAcceptedKvkk: (accepted) => set({ acceptedKvkk: accepted }),
      setOrderCompleted: (completed) => set({ isOrderCompleted: completed }),

      reset: () => set(initialState),

      // Computed
      canProceedToPayment: () => get().shippingInfo !== null,
      canProceedToReview: () => get().paymentMethod !== null,
      canPlaceOrder: () => get().acceptedTerms && get().acceptedKvkk,
    }),
    {
      name: "halikarnas-checkout",
      partialize: (state) => ({
        shippingInfo: state.shippingInfo,
        paymentMethod: state.paymentMethod,
      }),
    }
  )
);
```

### Step Navigation Component

```tsx
// src/components/checkout/CheckoutSteps.tsx
import { useCheckoutStore } from "@/stores/checkout-store";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, name: "Teslimat" },
  { id: 2, name: "Odeme" },
  { id: 3, name: "Onay" },
];

export function CheckoutSteps() {
  const currentStep = useCheckoutStore((state) => state.currentStep);

  return (
    <nav className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          {/* Step circle */}
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              step.id < currentStep && "bg-luxury-gold text-white",
              step.id === currentStep && "bg-luxury-primary text-white",
              step.id > currentStep && "bg-luxury-stone text-luxury-charcoal/50"
            )}
          >
            {step.id < currentStep ? (
              <Check className="w-4 h-4" />
            ) : (
              step.id
            )}
          </div>

          {/* Step name */}
          <span
            className={cn(
              "ml-2 text-sm",
              step.id <= currentStep
                ? "text-luxury-charcoal"
                : "text-luxury-charcoal/50"
            )}
          >
            {step.name}
          </span>

          {/* Connector line */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-16 h-0.5 mx-4",
                step.id < currentStep
                  ? "bg-luxury-gold"
                  : "bg-luxury-stone"
              )}
            />
          )}
        </div>
      ))}
    </nav>
  );
}
```

---

## Payment Method Handling

### Current Implementation (Cash on Delivery)

```tsx
// src/components/checkout/PaymentForm.tsx
export function PaymentForm() {
  const { paymentMethod, setPaymentMethod, nextStep } = useCheckoutStore();

  return (
    <div className="space-y-6">
      <RadioGroup
        value={paymentMethod}
        onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
      >
        {/* Cash on Delivery */}
        <div className="flex items-center space-x-3 p-4 border border-luxury-stone rounded-lg">
          <RadioGroupItem value="cash_on_delivery" id="cod" />
          <Label htmlFor="cod" className="flex-1 cursor-pointer">
            <div className="font-medium">Kapida Odeme</div>
            <div className="text-sm text-luxury-charcoal/60">
              Kapida nakit veya kredi karti ile odeme
            </div>
          </Label>
          <Banknote className="w-6 h-6 text-luxury-charcoal/40" />
        </div>

        {/* Credit Card (Placeholder) */}
        <div className="flex items-center space-x-3 p-4 border border-luxury-stone rounded-lg opacity-50">
          <RadioGroupItem value="card" id="card" disabled />
          <Label htmlFor="card" className="flex-1">
            <div className="font-medium">Kredi Karti</div>
            <div className="text-sm text-luxury-charcoal/60">
              Yakin zamanda aktif olacak
            </div>
          </Label>
          <CreditCard className="w-6 h-6 text-luxury-charcoal/40" />
        </div>
      </RadioGroup>

      <Button
        onClick={nextStep}
        className="w-full bg-luxury-primary hover:bg-luxury-primary-light"
      >
        Devam Et
      </Button>
    </div>
  );
}
```

### Future: iyzico Integration

```typescript
// TODO: iyzico entegrasyonu
// 1. npm install iyzipay
// 2. API endpoints: /api/payment/initialize, /api/payment/callback
// 3. 3D Secure flow
// 4. PaymentTransaction model
```

---

## Order Number Generation

```typescript
// src/lib/utils.ts
export function generateOrderNumber(): string {
  const prefix = "HS";
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${year}-${random}`;
}

// Output: HS-2024-A1B2C3
```

---

## Constants

```typescript
// src/lib/constants.ts
export const CHECKOUT_CONSTANTS = {
  FREE_SHIPPING_THRESHOLD: 500, // TL
  SHIPPING_COST: 49.9,          // TL
  MAX_QUANTITY_PER_ITEM: 10,
  MIN_ORDER_AMOUNT: 0,
};
```

---

*Bu skill checkout akisi, form validation, email entegrasyonu ve siparis islemleri icin referans olarak kullanilmalidir.*
