<script setup lang="ts">
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormField, FormMessage } from "@/components/ui/form";
import FormItem from "@/components/ui/form/FormItem.vue";
import FormLabel from "@/components/ui/form/FormLabel.vue";
import { ITEMS_REGISTRY } from "@shared/modules/items";
import ShopItemForm from "./ShopItemForm.vue";

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(2).max(50),
    inventory: z.object({
      items: z.array(z.object({
        key: z.string(),
        price: z.number(),
        grade: z.string().optional(),
      })),
      size: z.number(),
    }),
    ped: z.object({
      model: z.string(),
      pos: z.object({
        x: z.number(),
        y: z.number(),
        z: z.number(),
      }),
      heading: z.number(),
    }),
  }),
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: "",
    inventory: {
      items: [],
      size: 0,
    },
    ped: {
      model: "",
      pos: {
        x: 0, y: 0, z: 0
      },
      heading: 0,
    },
  },
});

const onSubmit = form.handleSubmit((values) => {
  console.log("Form submitted!", values);
});

function addItem(item: {
  key: string;
  price: number;
  grade?: string
}) {
  form.setFieldValue('inventory.items', [...(form.values.inventory?.items || []), item]);
}

function removeItem(index: number) {
  form.values.inventory?.items?.splice(index, 1);
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Shop</CardTitle>
      <CardDescription>
        Shops are places where players can buy items.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit="onSubmit" class="grid w-full items-center gap-4">
    <FormField v-slot="{ componentField }" name="name">
      <!-- 
        Name
      -->
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input type="text" placeholder="Name of the event" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          Name of the event is shown in nearby & active event notifications
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- 
      Inventory
    -->
    <FormField v-slot="{ componentField }" name="inventory">
      <FormItem>
        <FormLabel>Inventory</FormLabel>
        <FormControl>
          <!-- Inventory size -->
          <FormField v-slot="{ componentField }" name="inventory.size">
            <FormItem>
              <FormLabel>Size</FormLabel>
              <FormControl>
                <Input type="number" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Inventory items (array of key / grade if applicable / price) -->
          <!-- Should be a list with a button to add a new item -->

          <FormField v-slot="{ field }" name="inventory.items">
            <FormItem>
              <FormLabel>Items for sale</FormLabel>
              <FormControl>
                <div class="space-y-2">
                  <!-- Search and add item -->
                  <ShopItemForm @addItem="addItem" />

                  <!-- List of added items -->
                  <ul class="space-y-2">
                    <li v-for="(item, index) in field.value" :key="item.key"
                      class="flex items-center justify-between bg-neutral-900 p-2 rounded">
                      <span>{{ ITEMS_REGISTRY.get(item.key)?.name }} - ${{ item.price }}</span>
                      <Button type="button" variant="destructive" size="sm" @click="removeItem(index)">
                        Remove
                      </Button>
                    </li>
                  </ul>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- 
      Radius
    -->
    <FormField v-slot="{ componentField }" name="radius">
      <FormItem>
        <FormLabel>Radius</FormLabel>
        <FormControl>
          <Input type="number" placeholder="Radius of the event" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          Radius of the event in which nearby & active event notifications are shown
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- 
      Cooldown in seconds
    -->
    <FormField v-slot="{ componentField }" name="cooldownInSeconds">
      <FormItem>
        <FormLabel>Cooldown</FormLabel>
        <FormControl>
          <Input type="number" placeholder="Cooldown in seconds" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          Cooldown in seconds before the event can be triggered again
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit">Submit</Button>
  </form>
    </CardContent>
  </Card>
</template>
