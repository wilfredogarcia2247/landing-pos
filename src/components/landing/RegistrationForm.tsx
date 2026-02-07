import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  CheckCircle,
  AlertCircle,
  CreditCard,
  Shield,
  Zap,
  Lock,
  Receipt,
  Calculator,
  TrendingUp,
  Database,
  Cloud,
  FileCheck,
  ArrowRight,
  Loader2
} from "lucide-react";

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationForm = ({ isOpen, onClose }: RegistrationFormProps) => {
  console.log('RegistrationForm render - isOpen:', isOpen);
  
  const [formData, setFormData] = useState({
    // Información de Cuenta
    username: "",
    password: "",
    confirmPassword: "",
    
    // Información Personal
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    
    // Información de la Empresa
    businessName: "",
    businessType: "",
    taxId: "",
    description: "",
    
    // Dirección
    address: "",
    city: "",
    state: "",
    
    // Información Fiscal
    fiscalRegime: "",
    taxWithholding: "",
    
    // Términos y Condiciones
    acceptTerms: false,
    acceptPrivacy: false,
    acceptFiscal: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);

  const businessTypes = [
    { value: "restaurant", label: "Restaurante / Comida Rápida" },
    { value: "retail", label: "Tienda / Retail" },
    { value: "services", label: "Servicios Profesionales" },
    { value: "pharmacy", label: "Farmacia" },
    { value: "supermarket", label: "Supermercado" },
    { value: "other", label: "Otro" },
  ];

  const fiscalRegimes = [
    { value: "simplified", label: "Régimen Simplificado" },
    { value: "normal", label: "Régimen Normal" },
    { value: "special", label: "Régimen Especial" },
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setProcessingStage(0);
    
    // Simulate billing/processing stages with animations
    const stages = [
      { icon: Database, title: "Validando Información", delay: 500 },
      { icon: FileCheck, title: "Creando Cuenta", delay: 1000 },
      { icon: Receipt, title: "Configurando Facturación", delay: 1500 },
      { icon: Cloud, title: "Sincronizando con Sistema", delay: 2000 },
      { icon: CheckCircle, title: "¡Listo para Facturar!", delay: 2500 }
    ];

    for (let i = 0; i < stages.length; i++) {
      setProcessingStage(i);
      await new Promise(resolve => setTimeout(resolve, stages[i].delay));
    }
    
    // Here you would normally send data to your backend
    console.log("Form submitted:", formData);
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Redirect after showing success message
    setTimeout(() => {
      window.open('https://pos-prod.apps.icarosoft.com/login', '_blank', 'noopener,noreferrer');
      onClose();
      setShowSuccess(false);
      setProcessingStage(0);
    }, 3000);
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.username && formData.password && formData.confirmPassword && 
               formData.firstName && formData.lastName && formData.email && formData.phone &&
               formData.password === formData.confirmPassword && formData.password.length >= 8;
      case 2:
        return formData.businessName && formData.businessType && formData.taxId;
      case 3:
        return formData.address && formData.city && formData.state;
      case 4:
        return formData.fiscalRegime && formData.acceptTerms && formData.acceptPrivacy && formData.acceptFiscal;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (isStepValid(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Registra tu Empresa en ICARO POS
          </DialogTitle>
          <DialogDescription className="text-center">
            Comienza a facturar digitalmente con el sistema POS líder en Venezuela
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    step
                  )}
                </div>
                {step < 4 && (
                  <div
                    className={`w-full h-1 mx-2 ${
                      currentStep > step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Información de Cuenta y Personal */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Campos de Cuenta */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Información de Cuenta</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nombre de Usuario
                  </Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    placeholder="usuario123"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Contraseña
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      required
                      minLength={8}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Confirmar Contraseña
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      placeholder="Repite tu contraseña"
                      required
                      minLength={8}
                    />
                    {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-sm text-red-500">Las contraseñas no coinciden</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Campos Personales */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-primary">Información Personal</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Tu apellido"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Correo Electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+58 424 123 4567"
                    required
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Información de la Empresa */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="businessName" className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Nombre de la Empresa
                </Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange("businessName", e.target.value)}
                  placeholder="Mi Empresa CA"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType">Tipo de Negocio</Label>
                <Select
                  value={formData.businessType}
                  onValueChange={(value) => handleInputChange("businessType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de negocio" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  RIF / Tax ID
                </Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => handleInputChange("taxId", e.target.value)}
                  placeholder="J-123456789"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción del Negocio</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe brevemente tu negocio..."
                  rows={3}
                />
              </div>
            </motion.div>
          )}

          {/* Step 3: Dirección */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Dirección Fiscal
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Av. Principal #123"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Caracas"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="Distrito Capital"
                    required
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Información Fiscal y Términos */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fiscalRegime" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Régimen Fiscal
                  </Label>
                  <Select
                    value={formData.fiscalRegime}
                    onValueChange={(value) => handleInputChange("fiscalRegime", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu régimen fiscal" />
                    </SelectTrigger>
                    <SelectContent>
                      {fiscalRegimes.map((regime) => (
                        <SelectItem key={regime.value} value={regime.value}>
                          {regime.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxWithholding" className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Porcentaje de Retención IVA
                  </Label>
                  <Select
                    value={formData.taxWithholding}
                    onValueChange={(value) => handleInputChange("taxWithholding", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el porcentaje" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="75">75%</SelectItem>
                      <SelectItem value="100">100%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                  />
                  <Label htmlFor="acceptTerms" className="text-sm leading-relaxed">
                    Acepto los <span className="text-primary">términos y condiciones</span> de uso de ICARO POS
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptPrivacy"
                    checked={formData.acceptPrivacy}
                    onCheckedChange={(checked) => handleInputChange("acceptPrivacy", checked as boolean)}
                  />
                  <Label htmlFor="acceptPrivacy" className="text-sm leading-relaxed">
                    Autorizo el tratamiento de mis datos según la <span className="text-primary">política de privacidad</span>
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptFiscal"
                    checked={formData.acceptFiscal}
                    onCheckedChange={(checked) => handleInputChange("acceptFiscal", checked as boolean)}
                  />
                  <Label htmlFor="acceptFiscal" className="text-sm leading-relaxed">
                    Me comprometo a cumplir con las <span className="text-primary">obligaciones fiscales</span> vigentes en Venezuela
                  </Label>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Anterior
            </Button>

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
              >
                Siguiente
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!isStepValid(4) || isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                  />
                ) : (
                  "Completar Registro"
                )}
              </Button>
            )}
          </div>
        </form>

        {/* Processing Animation */}
        {isSubmitting && !showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-lg flex items-center justify-center"
          >
            <div className="text-center space-y-6 p-8 max-w-sm">
              {/* Animated Invoice Icon */}
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto border border-primary/20"
              >
                <Receipt className="w-10 h-10 text-primary" />
              </motion.div>
              
              {/* Processing Stages */}
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  <h3 className="text-lg font-semibold text-foreground">
                    {processingStage === 0 && "Validando Información"}
                    {processingStage === 1 && "Creando Cuenta"}
                    {processingStage === 2 && "Configurando Facturación"}
                    {processingStage === 3 && "Sincronizando con Sistema"}
                    {processingStage === 4 && "¡Listo para Facturar!"}
                  </h3>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary/70"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((processingStage + 1) / 5) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                
                {/* Stage Indicators */}
                <div className="flex justify-between items-center px-2">
                  {[
                    { icon: Database, label: "Validar" },
                    { icon: FileCheck, label: "Crear" },
                    { icon: Receipt, label: "Facturar" },
                    { icon: Cloud, label: "Sincronizar" },
                    { icon: CheckCircle, label: "Listo" }
                  ].map((stage, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{
                        scale: processingStage >= index ? 1 : 0.8,
                        opacity: processingStage >= index ? 1 : 0.5
                      }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center space-y-1"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        processingStage >= index 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <stage.icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-muted-foreground">{stage.label}</span>
                    </motion.div>
                  ))}
                </div>
                
                {/* Processing Details */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2 text-sm text-muted-foreground"
                >
                  {processingStage === 0 && (
                    <p>Verificando tus datos y disponibilidad de usuario...</p>
                  )}
                  {processingStage === 1 && (
                    <p>Creando tu cuenta en ICARO POS...</p>
                  )}
                  {processingStage === 2 && (
                    <p>Configurando tu perfil de facturación electrónica...</p>
                  )}
                  {processingStage === 3 && (
                    <p>Sincronizando con el sistema fiscal...</p>
                  )}
                  {processingStage === 4 && (
                    <p className="text-green-600 font-medium">¡Todo listo para empezar!</p>
                  )}
                </motion.div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
                <motion.div
                  initial={{ x: -50, y: -50, opacity: 0 }}
                  animate={{ x: 100, y: 100, opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                  className="absolute w-2 h-2 bg-primary/30 rounded-full"
                />
                <motion.div
                  initial={{ x: 50, y: -50, opacity: 0 }}
                  animate={{ x: -100, y: 100, opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute w-2 h-2 bg-primary/30 rounded-full"
                />
                <motion.div
                  initial={{ x: 0, y: 50, opacity: 0 }}
                  animate={{ x: 0, y: -100, opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                  className="absolute w-2 h-2 bg-primary/30 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-gradient-to-br from-green-50/95 to-primary/5 backdrop-blur-sm rounded-lg flex items-center justify-center"
          >
            <div className="text-center space-y-6 p-8 max-w-sm">
              {/* Success Icon with Ring Animation */}
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                
                {/* Animated Ring */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 1 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ delay: 0.3, duration: 1, repeat: 2 }}
                  className="absolute inset-0 w-20 h-20 bg-green-500/20 rounded-full mx-auto"
                />
              </div>
              
              {/* Success Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-primary bg-clip-text text-transparent">
                  ¡Registro Exitoso!
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tu cuenta ha sido creada exitosamente.
                  <br />
                  <span className="text-primary font-medium">ICARO POS</span> está listo para ti.
                </p>
              </motion.div>
              
              {/* Invoice Animation */}
              <motion.div
                initial={{ opacity: 0, rotate: -10 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="w-16 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center mx-auto border border-primary/20 shadow-sm"
              >
                <Receipt className="w-8 h-8 text-primary" />
              </motion.div>
              
              {/* Redirect Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span>Redirigiendo al inicio de sesión...</span>
                </div>
                
                {/* Countdown Timer */}
                <div className="flex justify-center space-x-1">
                  {[0, 1, 2].map((dot) => (
                    <motion.div
                      key={dot}
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1, 0] }}
                      transition={{ 
                        duration: 1, 
                        repeat: Infinity, 
                        delay: dot * 0.2,
                        repeatDelay: 0.5
                      }}
                      className="w-2 h-2 bg-primary rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
              
              {/* Confetti Effect */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      x: Math.random() * 200 - 100,
                      y: Math.random() * 200 - 100,
                      rotate: 0,
                      opacity: 0
                    }}
                    animate={{ 
                      x: Math.random() * 300 - 150,
                      y: Math.random() * 300 - 150,
                      rotate: 360,
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: i * 0.3,
                      repeatDelay: 1
                    }}
                    className="absolute w-1 h-4 bg-gradient-to-b from-primary to-green-500 rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationForm;
