from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class ClienteUsuarioManager(BaseUserManager):
    def create_user(self, correo, nombre, password=None, **extra_fields):
        if not correo:
            raise ValueError("El usuario debe tener un correo electrónico")
        correo = self.normalize_email(correo)
        user = self.model(correo=correo, nombre=nombre, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, correo, nombre, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(correo, nombre, password, **extra_fields)


class usuario(AbstractBaseUser, PermissionsMixin):
    usuario_id = models.AutoField(primary_key=True)
    correo = models.EmailField(unique=True, max_length=256)
    nombre = models.CharField(max_length=256)
    password = models.CharField(max_length=256)  
    objects = ClienteUsuarioManager()
    is_active = models.BooleanField(default=True)  
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['nombre']

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "usuario"
        verbose_name_plural = "usuarios"


class membresia(models.Model):
    id_membresia = models.AutoField(primary_key=True)
    nombre_membresia = models.CharField(max_length=100)
    fecha_creacion = models.DateField(auto_now_add=True)
    fecha_expiracion = models.DateField()

    def __str__(self):
        return self.nombre_membresia

    class Meta:
        db_table = 'membresia'  

