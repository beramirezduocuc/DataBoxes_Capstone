from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class Pais(models.Model):
    pais_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=256)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "pais"
        verbose_name_plural = verbose_name + "es"

class Ejecutivo(models.Model):
    ejecutivo_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=256)
    email = models.CharField(max_length=256)
    telefono = models.CharField(max_length=256)

    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name = "ejecutivo"
        verbose_name_plural = verbose_name + "s"

class Cliente(models.Model):
    cliente_id = models.AutoField(primary_key=True)
    fecha_creacion = models.DateField()
    fecha_expiracion = models.DateField()
    descripcion = models.CharField(max_length=256)
    max_usuarios = models.IntegerField()
    ejecutivo = models.ForeignKey(Ejecutivo, on_delete=models.CASCADE)
    pais = models.ForeignKey(Pais, on_delete=models.CASCADE)

    def __str__(self):
        return self.descripcion
    
    class Meta:
        verbose_name = "cliente"
        verbose_name_plural = verbose_name + "s"



class ClienteUsuarioManager(BaseUserManager):
    def create_user(self, email, nombre, clave=None, **extra_fields):
        if not email:
            raise ValueError("El usuario debe tener un correo electrónico")
        email = self.normalize_email(email)
        user = self.model(email=email, nombre=nombre, **extra_fields)
        user.set_password(clave)  
        user.save()
        return user

    def create_superuser(self, email, nombre, clave=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, nombre, clave, **extra_fields)


class ClienteUsuario(AbstractBaseUser, PermissionsMixin):
    cliente_usuario_id = models.AutoField(primary_key=True)
    #cliente = models.ForeignKey('Cliente', on_delete=models.CASCADE)
    email = models.EmailField(unique=True, max_length=256)
    nombre = models.CharField(max_length=256)
    clave = models.CharField(max_length=256)
    fecha_creacion = models.DateField(null=True)
    fecha_expiracion = models.DateField(null=True)
    cargo = models.CharField(max_length=256)
    telefono = models.IntegerField(null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = ClienteUsuarioManager()

    USERNAME_FIELD = 'email' 
    REQUIRED_FIELDS = ['nombre'] 

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "clienteUsuario"
        verbose_name_plural = verbose_name


class Objetivo(models.Model):
    objetivo_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=256)
    descripcion = models.CharField(max_length=256)
    servicio_id = models.IntegerField()

    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name = "objetivo"
        verbose_name_plural = verbose_name + "s"

class ObjetivoConfig(models.Model):
    objetivo_config_id = models.AutoField(primary_key=True)
    objetivo = models.ForeignKey(Objetivo, on_delete=models.CASCADE)
    fecha_creacion = models.DateField()
    periodo_entrenamiento = models.IntegerField()
    sensibilidad_z = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Config {self.objetivo.nombre}"
    
    class Meta:
        verbose_name = "objetivoConfig"
        verbose_name_plural = verbose_name 

class ClienteMapaClienteObjetivo(models.Model):
    cliente_mapa_cliente_objetivo = models.AutoField(primary_key=True)
    objetivo = models.ForeignKey(Objetivo, on_delete=models.CASCADE)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.cliente.descripcion} - {self.objetivo.nombre}"

    class Meta:
        verbose_name = "clienteMapaClienteObjetivo"
        verbose_name_plural = verbose_name

class DatosBucketsOutliers(models.Model):
    bucket_outlier_id = models.AutoField(primary_key=True)
    fecha = models.DateField()
    fecha_calculo = models.DateField()
    dato_id = models.IntegerField()
    valor = models.IntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['dato_id'], name='datos_buckets_outliers_constraint')
        ]

    class Meta:
        verbose_name = "datosBucketOutliers"
        verbose_name_plural = verbose_name 


class ParametrosIniciales(models.Model):
    bucket_id = models.AutoField(primary_key=True)
    fecha = models.DateField()
    objetivo_id = models.IntegerField()
    minimo = models.IntegerField()
    maximo = models.IntegerField()
    cantidad_datos = models.IntegerField()
    promedio = models.FloatField()
    desviacion_estandar = models.IntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['fecha', 'objetivo_id'], name='parametros_iniciales_constraint')
        ]

    class Meta:
        verbose_name = "parametrosIniciales"
        verbose_name_plural = verbose_name 

class Procesado(models.Model):
    fecha = models.DateField()
    objetivo_id = models.SmallIntegerField()
    bucket_id = models.SmallIntegerField()
    minimo = models.IntegerField()
    maximo = models.IntegerField()
    cantidad_datos = models.IntegerField()
    promedio = models.FloatField()
    desviacion_estandar = models.IntegerField()

    class Meta:
        verbose_name = "procesado"
        verbose_name_plural = verbose_name