import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormValues } from "@/types/form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import maponIcon from "@/assets/mapon.svg";
import Map from "../Map/Map";
import { schema } from "@/schemas/formSchema";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUnits } from "@/store/units/unitsSlice";
import { fetchRoute } from "@/store/routes/routesSlice";

export default function RouteReportForm() {
  const dispatch = useAppDispatch();
  const carList = useAppSelector((state) => state.units.list);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { vehicleId: "", from: "", to: "" },
  });

  useEffect(() => {
    dispatch(fetchUnits());
  }, [dispatch]);

  const onSubmit = (data: FormValues) => {
    dispatch(
      fetchRoute({
        unitId: data.vehicleId,
        from: `${data.from}T00:00:00Z`,
        till: `${data.to}T23:59:59Z`,
      })
    );
  };

  const periodErr = form.formState.errors.from || form.formState.errors.to;

  return (
    <div className="flex flex-col min-h-screen items-center gap-8 p-0  ">
      <img src={maponIcon} alt="Logo" />
      <Card className="mx-auto  rounded-sm bg-white shadow-md max-w-[600px] w-full h-auto pt-10 pb-0  ">
        <CardContent className="p-0 gap-6 flex flex-col">
          <h2 className=" text-left mb-4 text-xl font-semibold  px-6">
            Route report
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <div className="px-6 space-y-5">
                <FormField
                  control={form.control}
                  name="vehicleId"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between gap-2">
                        <FormLabel className="whitespace-nowrap">
                          <span>
                            Vehicle number
                            <span className="text-red-500">*</span>
                          </span>
                        </FormLabel>
                        <FormControl className="flex-1">
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full max-w-[380px] rounded-xs">
                              <SelectValue placeholder="Select…" />
                            </SelectTrigger>
                            <SelectContent>
                              {carList?.map((u) => (
                                <SelectItem
                                  key={u.unit_id}
                                  value={`${u.unit_id}`}
                                >
                                  {u.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap- justify-between">
                  <h3
                    className={`whitespace-nowrap font-semibold text-sm ${
                      periodErr ? "text-red-500" : ""
                    }`}
                  >
                    Period
                  </h3>
                  <div className="flex gap-2 flex-1 max-w-[380px] w-full ">
                    <FormField
                      control={form.control}
                      name="from"
                      render={({ field }) => (
                        <FormItem className="flex-1 ">
                          <FormLabel>From</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              className="w-full flex-1 rounded-xs "
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="to"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>To</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              className=" rounded-xs "
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <Map />
              <div className="flex justify-end bg-[#F4F4F4] py-4 px-6 mt-4 ">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="rounded-xs bg-[#98CA02] text-white hover:bg-[#87b202] pointer"
                >
                  GENERATE
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
