"""Add is_email_confirmed to User table

Revision ID: 8c7bf147253e
Revises: 98a97b6882a7
Create Date: 2024-04-02 10:38:12.563706

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8c7bf147253e'
down_revision = '98a97b6882a7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_email_confirmed', sa.Boolean(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('is_email_confirmed')

    # ### end Alembic commands ###
