/*
  Warnings:

  - You are about to drop the `avances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clientes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `desempenos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `detalle_orden` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `detalle_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `maquinas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `operaciones` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orden_produccion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permisos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `referencias` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuarios` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."avances" DROP CONSTRAINT "avances_id_detalle_fkey";

-- DropForeignKey
ALTER TABLE "public"."avances" DROP CONSTRAINT "avances_id_operacion_fkey";

-- DropForeignKey
ALTER TABLE "public"."desempenos" DROP CONSTRAINT "desempenos_id_orden_fkey";

-- DropForeignKey
ALTER TABLE "public"."detalle_orden" DROP CONSTRAINT "detalle_orden_id_orden_fkey";

-- DropForeignKey
ALTER TABLE "public"."detalle_orden" DROP CONSTRAINT "detalle_orden_id_referencia_fkey";

-- DropForeignKey
ALTER TABLE "public"."detalle_roles" DROP CONSTRAINT "detalle_roles_id_permiso_fkey";

-- DropForeignKey
ALTER TABLE "public"."detalle_roles" DROP CONSTRAINT "detalle_roles_id_rol_fkey";

-- DropForeignKey
ALTER TABLE "public"."operaciones" DROP CONSTRAINT "operaciones_id_maquina_fkey";

-- DropForeignKey
ALTER TABLE "public"."operaciones" DROP CONSTRAINT "operaciones_id_referencia_fkey";

-- DropForeignKey
ALTER TABLE "public"."orden_produccion" DROP CONSTRAINT "orden_produccion_id_cliente_fkey";

-- DropForeignKey
ALTER TABLE "public"."permisos" DROP CONSTRAINT "permisos_id_rol_fkey";

-- DropForeignKey
ALTER TABLE "public"."usuarios" DROP CONSTRAINT "usuarios_id_rol_fkey";

-- DropTable
DROP TABLE "public"."avances";

-- DropTable
DROP TABLE "public"."clientes";

-- DropTable
DROP TABLE "public"."desempenos";

-- DropTable
DROP TABLE "public"."detalle_orden";

-- DropTable
DROP TABLE "public"."detalle_roles";

-- DropTable
DROP TABLE "public"."maquinas";

-- DropTable
DROP TABLE "public"."operaciones";

-- DropTable
DROP TABLE "public"."orden_produccion";

-- DropTable
DROP TABLE "public"."permisos";

-- DropTable
DROP TABLE "public"."referencias";

-- DropTable
DROP TABLE "public"."roles";

-- DropTable
DROP TABLE "public"."usuarios";

-- DropEnum
DROP TYPE "public"."EstadoGeneral";

-- DropEnum
DROP TYPE "public"."EstadoOrden";

-- CreateTable
CREATE TABLE "public"."Roles" (
    "id_rol" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "public"."Permisos" (
    "id_permiso" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "id_rol" INTEGER NOT NULL,

    CONSTRAINT "Permisos_pkey" PRIMARY KEY ("id_permiso")
);

-- CreateTable
CREATE TABLE "public"."Usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "reset_codigo" TEXT,
    "reset_expira" TIMESTAMP(3),

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "public"."VerDetalleRol" (
    "id_detalle" SERIAL NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "id_permiso" INTEGER NOT NULL,

    CONSTRAINT "VerDetalleRol_pkey" PRIMARY KEY ("id_detalle")
);

-- CreateTable
CREATE TABLE "public"."Referencias" (
    "id_referencia" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Referencias_pkey" PRIMARY KEY ("id_referencia")
);

-- CreateTable
CREATE TABLE "public"."OrdenProduccion" (
    "id_orden" SERIAL NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL,
    "id_cliente" INTEGER NOT NULL,

    CONSTRAINT "OrdenProduccion_pkey" PRIMARY KEY ("id_orden")
);

-- CreateTable
CREATE TABLE "public"."Clientes" (
    "id_cliente" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" INTEGER,
    "correo" TEXT,
    "pagina" TEXT,

    CONSTRAINT "Clientes_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "public"."VerDetalleOrden" (
    "id_detalle" SERIAL NOT NULL,
    "id_orden" INTEGER NOT NULL,
    "id_referencia" INTEGER NOT NULL,
    "Cantidad" INTEGER NOT NULL,

    CONSTRAINT "VerDetalleOrden_pkey" PRIMARY KEY ("id_detalle")
);

-- CreateTable
CREATE TABLE "public"."Maquinas" (
    "id_maquina" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "Maquinas_pkey" PRIMARY KEY ("id_maquina")
);

-- CreateTable
CREATE TABLE "public"."Operaciones" (
    "id_operacion" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "id_referencia" INTEGER NOT NULL,
    "id_maquina" INTEGER NOT NULL,
    "cantidad_estimada" INTEGER NOT NULL,

    CONSTRAINT "Operaciones_pkey" PRIMARY KEY ("id_operacion")
);

-- CreateTable
CREATE TABLE "public"."Avances" (
    "id_avance" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL,
    "id_detalle" INTEGER NOT NULL,
    "id_operacion" INTEGER NOT NULL,

    CONSTRAINT "Avances_pkey" PRIMARY KEY ("id_avance")
);

-- CreateTable
CREATE TABLE "public"."Operarias" (
    "id_operaria" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "Operarias_pkey" PRIMARY KEY ("id_operaria")
);

-- CreateTable
CREATE TABLE "public"."Desempeno" (
    "id_desempeno" SERIAL NOT NULL,
    "Cantida_producida" INTEGER NOT NULL,
    "productividad" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_orden" INTEGER NOT NULL,

    CONSTRAINT "Desempeno_pkey" PRIMARY KEY ("id_desempeno")
);

-- CreateTable
CREATE TABLE "public"."VerDetalleDesempeno" (
    "id_detalle" SERIAL NOT NULL,
    "id_desempeno" INTEGER NOT NULL,
    "id_operaria" INTEGER NOT NULL,
    "id_operacion" INTEGER NOT NULL,
    "Cantidad" INTEGER NOT NULL,
    "Eficiencia" BOOLEAN NOT NULL,
    "Porcentaje" DOUBLE PRECISION NOT NULL,
    "id_detalle_orden" INTEGER,

    CONSTRAINT "VerDetalleDesempeno_pkey" PRIMARY KEY ("id_detalle")
);

-- CreateTable
CREATE TABLE "public"."ReportesDesempeno" (
    "id_reporte" SERIAL NOT NULL,
    "desempeno_operaria" TEXT NOT NULL,
    "prendas_producidas" INTEGER NOT NULL,
    "hora_revision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_detalle_desempeno" INTEGER NOT NULL,
    "id_desempeno" INTEGER,

    CONSTRAINT "ReportesDesempeno_pkey" PRIMARY KEY ("id_reporte")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_correo_key" ON "public"."Usuarios"("correo");

-- AddForeignKey
ALTER TABLE "public"."Permisos" ADD CONSTRAINT "Permisos_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "public"."Roles"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Usuarios" ADD CONSTRAINT "Usuarios_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "public"."Roles"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VerDetalleRol" ADD CONSTRAINT "VerDetalleRol_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "public"."Roles"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VerDetalleRol" ADD CONSTRAINT "VerDetalleRol_id_permiso_fkey" FOREIGN KEY ("id_permiso") REFERENCES "public"."Permisos"("id_permiso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrdenProduccion" ADD CONSTRAINT "OrdenProduccion_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "public"."Clientes"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VerDetalleOrden" ADD CONSTRAINT "VerDetalleOrden_id_orden_fkey" FOREIGN KEY ("id_orden") REFERENCES "public"."OrdenProduccion"("id_orden") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VerDetalleOrden" ADD CONSTRAINT "VerDetalleOrden_id_referencia_fkey" FOREIGN KEY ("id_referencia") REFERENCES "public"."Referencias"("id_referencia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Operaciones" ADD CONSTRAINT "Operaciones_id_referencia_fkey" FOREIGN KEY ("id_referencia") REFERENCES "public"."Referencias"("id_referencia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Operaciones" ADD CONSTRAINT "Operaciones_id_maquina_fkey" FOREIGN KEY ("id_maquina") REFERENCES "public"."Maquinas"("id_maquina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Avances" ADD CONSTRAINT "Avances_id_detalle_fkey" FOREIGN KEY ("id_detalle") REFERENCES "public"."VerDetalleOrden"("id_detalle") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Avances" ADD CONSTRAINT "Avances_id_operacion_fkey" FOREIGN KEY ("id_operacion") REFERENCES "public"."Operaciones"("id_operacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Desempeno" ADD CONSTRAINT "Desempeno_id_orden_fkey" FOREIGN KEY ("id_orden") REFERENCES "public"."OrdenProduccion"("id_orden") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VerDetalleDesempeno" ADD CONSTRAINT "VerDetalleDesempeno_id_desempeno_fkey" FOREIGN KEY ("id_desempeno") REFERENCES "public"."Desempeno"("id_desempeno") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VerDetalleDesempeno" ADD CONSTRAINT "VerDetalleDesempeno_id_operaria_fkey" FOREIGN KEY ("id_operaria") REFERENCES "public"."Operarias"("id_operaria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VerDetalleDesempeno" ADD CONSTRAINT "VerDetalleDesempeno_id_operacion_fkey" FOREIGN KEY ("id_operacion") REFERENCES "public"."Operaciones"("id_operacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VerDetalleDesempeno" ADD CONSTRAINT "VerDetalleDesempeno_id_detalle_orden_fkey" FOREIGN KEY ("id_detalle_orden") REFERENCES "public"."VerDetalleOrden"("id_detalle") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReportesDesempeno" ADD CONSTRAINT "ReportesDesempeno_id_detalle_desempeno_fkey" FOREIGN KEY ("id_detalle_desempeno") REFERENCES "public"."VerDetalleDesempeno"("id_detalle") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReportesDesempeno" ADD CONSTRAINT "ReportesDesempeno_id_desempeno_fkey" FOREIGN KEY ("id_desempeno") REFERENCES "public"."Desempeno"("id_desempeno") ON DELETE SET NULL ON UPDATE CASCADE;
