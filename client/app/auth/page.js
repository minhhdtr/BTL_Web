"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "next/navigation";
import {
  loginUser,
  registerUser,
  sendVerifyOtp,
} from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AuthForm() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(
    searchParams.get("isLogin") === "true"
  );
  const { user, isLoading, error, isAuthenticated, message } = useSelector(
    (state) => state.auth
  );

  // Schema validation
  const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password has at least 6 chars"),
  });

  const registerSchema = loginSchema.extend({
    name: z.string().min(3, "Username has at least 6 chars"),
  });

  const form = useForm({
    defaultValues: isLogin
      ? { email: "", password: "" }
      : { name: "", email: "", password: "" },
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  });

  const onSubmit = (data) => {
    if (isLogin) {
      dispatch(loginUser(data));
    } else {
      dispatch(registerUser(data));
    }
  };

  const handleForgetPassWord = () => {
    router.push("/auth/forget-password");
  };

  useEffect(() => {
    if (isAuthenticated && isLogin) {
      toast.success(message);
      router.push("/");
    } else if (user && isAuthenticated === false) {
      dispatch(sendVerifyOtp({id :user.id}));
      toast.success(message);
      router.push("/auth/verify?type=verify-email");
    } 
  }, [message]);
  useEffect(() => {
    if(error !== null){
      toast.error(error);
    }
  },[error])

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <AnimatePresence mode="wait">
        <motion.div
          key={isLogin ? "login" : "register"}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-[400px] shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">
                {isLogin ? "Login" : "Register"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Nếu là đăng ký thì hiển thị trường username */}
                  {!isLogin && (
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter username" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Mật khẩu */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {isLogin && (
                    <button
                      type="button"
                      className="text-blue-500 hover:underline text-center items-center text-sm "
                      onClick={handleForgetPassWord}
                    >
                      Forget Password
                    </button>
                  )}

                  {/* Nút Submit */}
                  <Button className="w-full" type="submit">
                    {isLoading
                      ? "Đang xử lý..."
                      : isLogin
                      ? "Login"
                      : "Register"}
                  </Button>
                </form>
              </Form>

              {/* Nút đổi trạng thái giữa đăng nhập / đăng ký */}
              <p className="text-center text-sm mt-4">
                {isLogin ? "No account yet?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Register" : "Login"}
                </button>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
