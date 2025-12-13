-- CreateEnum
CREATE TYPE "public"."EstadoGeneral" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "public"."EstadoOrden" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'TERMINADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "public"."roles" (
    "id_rol" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" "public"."EstadoGeneral" NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "public"."permisos" (
    "id_permiso" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "id_rol" INTEGER NOT NULL,

    CONSTRAINT "permisos_pkey" PRIMARY KEY ("id_permiso")
);

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "estado" "public"."EstadoGeneral" NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "reset_codigo" TEXT,
    "reset_expira" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "public"."detalle_roles" (
    "id_detalle" SERIAL NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "id_permiso" INTEGER NOT NULL,

    CONSTRAINT "detalle_roles_pkey" PRIMARY KEY ("id_detalle")
);

-- CreateTable
CREATE TABLE "public"."clientes" (
    "id_cliente" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" INTEGER,
    "correo" TEXT,
    "pagina" TEXT,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "public"."orden_produccion" (
    "id_orden" SERIAL NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "public"."EstadoOrden" NOT NULL,
    "id_cliente" INTEGER NOT NULL,

    CONSTRAINT "orden_produccion_pkey" PRIMARY KEY ("id_orden")
);

-- CreateTable
CREATE TABLE "public"."referencias" (
    "id_referencia" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "referencias_pkey" PRIMARY KEY ("id_referencia")
);

-- CreateTable
CREATE TABLE "public"."detalle_orden" (
    "id_detalle" SERIAL NOT NULL,
    "id_orden" INTEGER NOT NULL,
    "id_referencia" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "detalle_orden_pkey" PRIMARY KEY ("id_detalle")
);

-- CreateTable
CREATE TABLE "public"."maquinas" (
    "id_maquina" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "estado" "public"."EstadoGeneral" NOT NULL,

    CONSTRAINT "maquinas_pkey" PRIMARY KEY ("id_maquina")
);

-- CreateTable
CREATE TABLE "public"."operaciones" (
    "id_operacion" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" "public"."EstadoGeneral" NOT NULL,
    "id_referencia" INTEGER NOT NULL,
    "id_maquina" INTEGER NOT NULL,
    "cantidad_estimada" INTEGER NOT NULL,

    CONSTRAINT "operaciones_pkey" PRIMARY KEY ("id_operacion")
);

-- CreateTable
CREATE TABLE "public"."avances" (
    "id_avance" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "public"."EstadoGeneral" NOT NULL,
    "id_detalle" INTEGER NOT NULL,
    "id_operacion" INTEGER NOT NULL,

    CONSTRAINT "avances_pkey" PRIMARY KEY ("id_avance")
);

-- CreateTable
CREATE TABLE "public"."desempenos" (
    "id_desempeno" SERIAL NOT NULL,
    "cantidad_producida" INTEGER NOT NULL,
    "productividad" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_orden" INTEGER NOT NULL,

    CONSTRAINT "desempenos_pkey" PRIMARY KEY ("id_desempeno")
);

-- CreateIndex
CREATE INDEX "permisos_id_rol_idx" ON "public"."permisos"("id_rol");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "public"."usuarios"("correo");

-- CreateIndex
CREATE INDEX "usuarios_id_rol_idx" ON "public"."usuarios"("id_rol");

-- CreateIndex
CREATE INDEX "detalle_roles_id_rol_idx" ON "public"."detalle_roles"("id_rol");

-- CreateIndex
CREATE INDEX "detalle_roles_id_permiso_idx" ON "public"."detalle_roles"("id_permiso");

-- CreateIndex
CREATE INDEX "orden_produccion_id_cliente_idx" ON "public"."orden_produccion"("id_cliente");

-- CreateIndex
CREATE INDEX "detalle_orden_id_orden_idx" ON "public"."detalle_orden"("id_orden");

-- CreateIndex
CREATE INDEX "detalle_orden_id_referencia_idx" ON "public"."detalle_orden"("id_referencia");

-- CreateIndex
CREATE INDEX "operaciones_id_referencia_idx" ON "public"."operaciones"("id_referencia");

-- CreateIndex
CREATE INDEX "operaciones_id_maquina_idx" ON "public"."operaciones"("id_maquina");

-- CreateIndex
CREATE INDEX "avances_id_detalle_idx" ON "public"."avances"("id_detalle");

-- CreateIndex
CREATE INDEX "avances_id_operacion_idx" ON "public"."avances"("id_operacion");

-- CreateIndex
CREATE INDEX "desempenos_id_orden_idx" ON "public"."desempenos"("id_orden");

-- AddForeignKey
ALTER TABLE "public"."permisos" ADD CONSTRAINT "permisos_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "public"."roles"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "usuarios_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "public"."roles"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."detalle_roles" ADD CONSTRAINT "detalle_roles_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "public"."roles"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."detalle_roles" ADD CONSTRAINT "detalle_roles_id_permiso_fkey" FOREIGN KEY ("id_permiso") REFERENCES "public"."permisos"("id_permiso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orden_produccion" ADD CONSTRAINT "orden_produccion_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "public"."clientes"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."detalle_orden" ADD CONSTRAINT "detalle_orden_id_orden_fkey" FOREIGN KEY ("id_orden") REFERENCES "public"."orden_produccion"("id_orden") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."detalle_orden" ADD CONSTRAINT "detalle_orden_id_referencia_fkey" FOREIGN KEY ("id_referencia") REFERENCES "public"."referencias"("id_referencia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."operaciones" ADD CONSTRAINT "operaciones_id_referencia_fkey" FOREIGN KEY ("id_referencia") REFERENCES "public"."referencias"("id_referencia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."operaciones" ADD CONSTRAINT "operaciones_id_maquina_fkey" FOREIGN KEY ("id_maquina") REFERENCES "public"."maquinas"("id_maquina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."avances" ADD CONSTRAINT "avances_id_detalle_fkey" FOREIGN KEY ("id_detalle") REFERENCES "public"."detalle_orden"("id_detalle") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."avances" ADD CONSTRAINT "avances_id_operacion_fkey" FOREIGN KEY ("id_operacion") REFERENCES "public"."operaciones"("id_operacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."desempenos" ADD CONSTRAINT "desempenos_id_orden_fkey" FOREIGN KEY ("id_orden") REFERENCES "public"."orden_produccion"("id_orden") ON DELETE RESTRICT ON UPDATE CASCADE;
