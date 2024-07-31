<script setup lang="ts">
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { WorldEventType } from "@shared/enums/world-event-type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormField, FormMessage } from "@/components/ui/form";
import FormItem from "@/components/ui/form/FormItem.vue";
import FormLabel from "@/components/ui/form/FormLabel.vue";

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(2).max(50),
    type: z.nativeEnum(WorldEventType),
    radius: z.number().min(1),
    cooldownInSeconds: z.number().min(1),
  }),
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit((values) => {
  console.log("Form submitted!", values);
});
</script>

<template>
  <form
    @submit="onSubmit"
    class="grid w-full items-center gap-4"
  >
    <FormField
      v-slot="{ componentField }"
      name="name"
    >
      <!-- 
        Name
      -->
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input
            type="text"
            placeholder="Name of the event"
            v-bind="componentField"
          />
        </FormControl>
        <FormDescription>
          Name of the event is shown in nearby & active event notifications
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- 
      Type
    -->
    <FormField
      v-slot="{ componentField }"
      name="type"
    >
      <FormItem>
        <FormLabel>Event type</FormLabel>
        <FormControl>
          <Select v-bind="componentField">
            <SelectTrigger>
              <SelectValue
                placeholder="Select"
                class="capitalize"
              />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem
                v-for="type in Object.values(WorldEventType)"
                :key="type"
                :value="type"
                class="capitalize"
              >
                {{ type.split("-").join(" ") }}
              </SelectItem>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- 
      Radius
    -->
    <FormField
      v-slot="{ componentField }"
      name="radius"
    >
      <FormItem>
        <FormLabel>Radius</FormLabel>
        <FormControl>
          <Input
            type="number"
            placeholder="Radius of the event"
            v-bind="componentField"
          />
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
    <FormField
      v-slot="{ componentField }"
      name="cooldownInSeconds"
    >
      <FormItem>
        <FormLabel>Cooldown</FormLabel>
        <FormControl>
          <Input
            type="number"
            placeholder="Cooldown in seconds"
            v-bind="componentField"
          />
        </FormControl>
        <FormDescription>
          Cooldown in seconds before the event can be triggered again
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit">Submit</Button>
  </form>
</template>
